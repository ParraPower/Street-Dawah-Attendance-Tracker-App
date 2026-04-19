import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

import { env } from './shared/infrastructure/config/env';
import AppDataSource from './data/data-source';
import { app, buildControllers } from './app';
import { useOnLoadKeyIntoKeyCache } from "./features/auth/infrastructure/jwt/useOnLoadKeyIntoCache.hook";
import { useOnLoadEnsureKeyExists } from "./features/auth/infrastructure/jwt/useOnLoadEnsureKeyExists.hook";


async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connected');
  
  buildControllers(app, AppDataSource);

  await new useOnLoadEnsureKeyExists().execute()

  await new useOnLoadKeyIntoKeyCache().execute()

  app.listen(env.port, () => {
    console.log(`Auth API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
