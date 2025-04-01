import { mkdir } from 'fs/promises'

import { merge } from 'lodash-es'

import { builtinThemesDirectory, customThemesDirectory, userspaceBombsitesPath, userspaceDirectory, userspaceRadarsPath, userspaceSettingsPath } from './helpers/paths.js'
import { fileExists } from './helpers/file-exists.js'
import { readJson, readJsonIfExists, writeJson } from './helpers/json-file.js'

export const initSettings = async () => {
	if (await fileExists(userspaceSettingsPath)) return

	await mkdir(userspaceDirectory, { recursive: true })

	await writeJson(userspaceSettingsPath, {
		parent: 'fennec',
	})
}

export const getSettings = async () => {
	const themeTree = ['userspace']

	const bombsiteObjects = [await readJsonIfExists(userspaceBombsitesPath)]
	const radarObjects = [await readJsonIfExists(userspaceRadarsPath)]
	const settingsObjects = [await readJson(userspaceSettingsPath)]

	while (settingsObjects[settingsObjects.length - 1].parent) {
		const parent = settingsObjects[settingsObjects.length - 1].parent
		themeTree.push(parent)

		if (await fileExists(`${customThemesDirectory}/${parent}/theme.json`)) {
			settingsObjects.push(
				await readJson(`${customThemesDirectory}/${parent}/theme.json`),
			)
		} else if (await fileExists(`${builtinThemesDirectory}/${parent}/theme.json`)) {
			settingsObjects.push(
				await readJson(`${builtinThemesDirectory}/${parent}/theme.json`),
			)
		} else {
			throw new Error(`Theme "${parent}" not found. Please change the "theme" value in cs-hud/userspace/theme.json.`)
		}

		if (await fileExists(`${customThemesDirectory}/${parent}/bombsites.json`)) {
			bombsiteObjects.push(
				await readJson(`${customThemesDirectory}/${parent}/bombsites.json`),
			)
		} else if (await fileExists(`${builtinThemesDirectory}/${parent}/bombsites.json`)) {
			bombsiteObjects.push(
				await readJson(`${builtinThemesDirectory}/${parent}/bombsites.json`),
			)
		}

		if (await fileExists(`${customThemesDirectory}/${parent}/radars.json`)) {
			radarObjects.push(
				await readJson(`${customThemesDirectory}/${parent}/radars.json`),
			)
		} else if (await fileExists(`${builtinThemesDirectory}/${parent}/radars.json`)) {
			radarObjects.push(
				await readJson(`${builtinThemesDirectory}/${parent}/radars.json`),
			)
		}
	}

	return {
		themeTree,

		bombsites: merge({}, ...bombsiteObjects.reverse()),
		radars: merge({}, ...radarObjects.reverse()),
		settings: merge({}, ...settingsObjects.reverse()),
	}
}

export const getThemeTree = async (firstTheme = 'userspace') => {
	const themeTree = [firstTheme]

	// make sure we don't end up in this loop forever
	for (let i = 0; i < 16; i++) {
		let settingsObject

		if (await fileExists(`${customThemesDirectory}/${themeTree[themeTree.length - 1]}/theme.json`)) {
			settingsObject = await readJson(`${customThemesDirectory}/${themeTree[themeTree.length - 1]}/theme.json`)
		} else if (await fileExists(`${builtinThemesDirectory}/${themeTree[themeTree.length - 1]}/theme.json`)) {
			settingsObject = await readJson(`${builtinThemesDirectory}/${themeTree[themeTree.length - 1]}/theme.json`)
		} else {
			throw new Error(`Theme "${parent}" not found`)
		}

		if (! settingsObject?.parent) return themeTree

		themeTree.push(settingsObject.parent)
	}

	return themeTree
}

export const updatePlayerNameOverrides = async (steamID, newName) => {
  const settings = await readJson(userspaceSettingsPath);

  let playerNameOverrides = settings.options['teams.playerNameOverrides']?.value || '';
  const lines = playerNameOverrides.split('\n').filter(line => line.trim() !== '');

  // 移除旧的条目
  const newLines = lines.filter(line => {
    const segments = line.split(/\s+/);
    return segments[0] !== steamID;
  });

  // 添加新的条目
  newLines.push(`${steamID} ${newName}`);

  // 更新设置
  settings.options['teams.playerNameOverrides'] = {
    value: newLines.join('\n'),
  };

  // 保存设置
  await writeJson(userspaceSettingsPath, settings);

  return settings;
};