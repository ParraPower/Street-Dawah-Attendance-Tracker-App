import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { config } from "dotenv";

const env = process.env.NODE_ENV || "local";
const envFile = `.env.${env}`;
const envPath = resolve(process.cwd(), envFile);

// Load environment file if it exists
if (existsSync(envPath)) {
  console.log(`🔧 Loading environment: ${envFile}`);
  config({ path: envPath });
} else {
  console.warn(`⚠️ Environment file ${envFile} not found. Falling back to process.env`);
}

import { createDataSource } from '@street-dawah/app-framework'
import { UserEntity } from '../src/features/users/domain/entities/user-entity'
const AppDataSource = createDataSource('blah', [ UserEntity ] as never, __dirname + "/../migrations/*.ts");

export default AppDataSource;