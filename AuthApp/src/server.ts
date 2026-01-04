import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
console.log('Loading environment variables from .env file', process.env);

import { env } from './config/env';
//import { AppDataSource } from './config/ormconfig';
import { app } from './app';
import { loadKeysIntoCache } from './security/key-cache';


async function bootstrap() {
  //await AppDataSource.initialize();
  await loadKeysIntoCache();

  app.listen(env.port, () => {
    console.log(`Auth API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
