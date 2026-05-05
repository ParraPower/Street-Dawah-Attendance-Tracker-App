import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

import { env } from '@attendance/infrastructure/config/env';
import AppDataSource from '@attendance/data/data-source';
import { app } from '@attendance/app';

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connected');

  // buildControllers

  // ensure public key from KWS service loaded into cache
  
  // Start HTTP server
  app.listen(env.port, () => {
    console.log(`Auth API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

