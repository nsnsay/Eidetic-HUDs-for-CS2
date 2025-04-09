import send from 'koa-send';
import { initSettings, getSettings, updateMapData } from './settings.js'; // 确保没有循环引用

import { readJson, writeJson } from './helpers/json-file.js';
import {
  builtinRootDirectory,
  userspaceSettingsPath,
} from './helpers/paths.js';

import path from 'path';
export const registerConfigRoutes = (router, websocket) => {
  router.get('/', (context) => {
    context.status = 302;
    context.redirect('/config');
  });

  router.get('/config/options', async (context) => {
    const { settings } = await getSettings().catch((err) => {
      console.error('Error getting settings', err);
      return { settings: { options: {} } };
    });

    context.body = [
      {
        fallback: 'fennec',
        key: 'theme',
        section: 'Theme',
        type: 'string',
        value: settings.parent,
      },

      ...Object.entries(settings.options).map(([key, data]) => ({
        ...data,
        key,
        sectionDescription: settings.optionSectionDescriptions?.[data.section],
      })),
    ];
  });

  router.put('/config/options/update-map-data', async (context) => {
    const { themeName, mapData } = context.request.body;

    if (!themeName || !mapData) {
      context.status = 400;
      return;
    }

    try {
      await updateMapData(themeName, mapData);
      context.status = 204;
    } catch (error) {
      console.error('Error updating map data', error);
      context.status = 500;
    }
  });

  router.get('/config{/*path}', async (context) => {
    await send(context, context.params.path?.trim() || 'index.html', {
      root: `${builtinRootDirectory}/src/config/`,
    });
  });

  router.put('/config/options', async (context) => {
    const settings = await readJson(userspaceSettingsPath);

    if (!settings.options) settings.options = {};

    let wasThemeChanged = false;

    for (const [key, value] of Object.entries(context.request.body)) {
      if (key === 'theme') {
        wasThemeChanged = settings.parent !== (value || 'fennec');
        settings.parent = value || 'fennec';
      } else if (value != null) {
        // this SHOULD be a double-equal instead of triple-equal (similar to lodash's isNil)
        if (!settings.options[key]) settings.options[key] = {};
        settings.options[key].value = value;
      } else if (settings.options[key]) {
        delete settings.options[key].value;
      }
    }

    await writeJson(userspaceSettingsPath, settings);
    await websocket.updateCaches();

    if (wasThemeChanged) websocket.broadcastRefresh();

    context.status = 204;
  }),
    router.post('/config/force-hud-refresh', async (context) => {
      websocket.broadcastRefresh();
      context.status = 204;
    });

  router.put('/config/options/rename-player', async (context) => {
    const { steamID, newName } = context.request.body;

    if (!steamID || !newName) {
      context.status = 400;
      return;
    }

    try {
      await updatePlayerNameOverrides(steamID, newName);
      context.status = 204;
    } catch (error) {
      console.error('Error updating player name overrides', error);
      context.status = 500;
    }
  });
};
