// src/server/index.js
import http from 'http';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaCompress from 'koa-compress';
import pc from 'picocolors';

// 引入项目中的其他模块
import { initSettings, getSettings } from './settings.js';
import { registerConfigRoutes } from './config.js';
import { registerDependencyRoutes } from './dependencies.js';
import { registerGsiRoutes } from './gsi.js';
import { registerHudRoutes } from './hud.js';
import { registerLicensesRoutes } from './licenses.js';
import { registerRadarRoutes } from './radar.js';
import { registerVersionRoutes } from './version.js';
import { Websocket } from './websocket.js';

Error.stackTraceLimit = 64;

const run = async () => {
  await initSettings();
  const { settings } = await getSettings();

  const host = process.env.HOST || settings.host || '0.0.0.0';
  const port = process.env.PORT || settings.port || 31982;

  const app = new Koa();
  const server = http.createServer(app.callback());

  app.use(KoaCompress());

  app.use(bodyParser({
    strict: true,
    enableTypes: ['json'],
  }));

  const websocket = new Websocket(server);

  // register routes
  const router = new KoaRouter();
  registerConfigRoutes(router, websocket);
  registerDependencyRoutes(router);
  registerGsiRoutes(router, websocket);
  registerHudRoutes(router);
  registerLicensesRoutes(router);
  registerRadarRoutes(router);
  registerVersionRoutes(router);

  // start server
  app.use(router.routes());
  app.use(router.allowedMethods());

  server.listen(port, host, () => {
    console.info(pc.bold(pc.yellow(`HUD Control Panel -> . http://127.0.0.1:${port}`)));
    console.info(pc.bold(pc.green(`OBS Capture URL -> . http://127.0.0.1:${port}/hud?transparent`)));
    console.info(pc.bold(pc.white(`-------------------------------------------------------------`)));
    console.info(pc.bold(pc.white(`Currently using the custom radars, Any bug seeks please report at Github!`)));
    console.info(pc.bold(pc.cyan(`Hold CTRL + C to quit.`)));
    console.info(pc.bold(pc.white(`---------------Log Output---------------`)));
  });
};

process.on('uncaughtException', (error) => {
  // 忽略所有未处理的异常
  console.log('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  // 忽略所有未处理的 promise rejection
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 启动 Electron 应用

run().then(() => {});