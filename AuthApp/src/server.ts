import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

import { env } from './config/env';
import AppDataSource from './data/data-source';
import { app, buildControllers } from './app';
import { loadKeysIntoCache } from './security/key-cache';
import { JwtKeyService } from "./modules/jwt-keys/jwt-key-service";
import { JwtKey } from "./domains/keys/key-entity";


async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connected');
  
  buildControllers(app, AppDataSource);

  const jwtKeyService = new JwtKeyService(
    AppDataSource.getRepository(JwtKey)
  );

  await jwtKeyService.ensureKeyExists();

  await loadKeysIntoCache();

  app.listen(env.port, () => {
    console.log(`Auth API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
