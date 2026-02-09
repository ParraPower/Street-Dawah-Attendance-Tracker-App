import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

import { env } from '@/config/env';
import AppDataSource from '@/data/data-source';
import { app } from '@/app';

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connected');

  // run migrations (if any)
  // await AppDataSource.runMigrations(); 
  // Note: In production, you might want to run migrations separately using CLI or a script instead of on app startup.

  // Start HTTP server
  app.listen(env.port, () => {
    console.log(`Auth API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

