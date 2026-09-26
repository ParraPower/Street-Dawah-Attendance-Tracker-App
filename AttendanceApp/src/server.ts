import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

import { env } from '@attendance/infrastructure/config/env';
import AppDataSource from '@attendance/data/data-source';
import { app, buildControllers } from '@attendance/app';
import { initSwagger } from './infrastructure/api/swagger';
import { UseOnLoadKeyIntoKeyCache } from "@attendance/features/auth/infrastructure/jwt/useOnLoadKeyIntoKeyCache";
import { BaseController, KeyCacheService } from 'app-framework';
import { JwksService } from "./infrastructure/jwt";
import { routeRegistry } from './infrastructure/shared/swagger/route-registry';

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connected');

  // buildControllers
  // patch BaseController.registerRoute to capture runtime route metadata
  try {
    const _origRegister = (BaseController as any).prototype.registerRoute;
    (BaseController as any).prototype.registerRoute = function (method: string, routePath: string, handler: any, options?: any) {
      try {
        routeRegistry.add({
          controller: this.constructor?.name ?? 'UnknownController',
          method: (method || '').toLowerCase(),
          path: routePath,
          handlerName: handler?.name,
          options
        });
      } catch (e) { /* don't break startup */ }
      return _origRegister.apply(this, arguments as any);
    };
  } catch (e) {
    console.warn('Failed to patch BaseController.registerRoute:', e);
  }

  buildControllers(app, AppDataSource);

  // initialize swagger UI (serves /openapi.json and /api/docs)
  initSwagger(app);
  
  // ensure public key from KWS service loaded into cache
  const useOnLoadKeyIntoKeyCache = new UseOnLoadKeyIntoKeyCache(new JwksService(env.jwksUri), new KeyCacheService());
  await useOnLoadKeyIntoKeyCache.execute();

  // Start HTTP server
  app.listen(env.port, () => {
    console.log(`Attendance API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});


