import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

import { env } from '@attendance/infrastructure/config/env';
import AppDataSource from '@attendance/data/data-source';
import { app, buildControllers } from '@attendance/app';
import { UseOnLoadKeyIntoKeyCache } from "@attendance/features/auth/infrastructure/jwt/useOnLoadKeyIntoKeyCache";
import { KeyCacheService } from 'app-framework';
import { JwksService } from "./infrastructure/jwt";

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connected');

  // buildControllers
  buildControllers(app, AppDataSource);
  
  // ensure public key from KWS service loaded into cache
  const useOnLoadKeyIntoKeyCache = new UseOnLoadKeyIntoKeyCache(new JwksService(env.jwksUri), new KeyCacheService());
  await useOnLoadKeyIntoKeyCache.execute();

  // Start HTTP server
  app.listen(env.port, () => {
    console.log(`Auth API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});


