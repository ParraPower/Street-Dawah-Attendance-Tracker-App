// import path from "node:path";
// import dotenv from "dotenv";

// dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

// console.log('Loading environment variables from .env file', process.env.NODE_ENV);

import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "local";
const envFile = `.env.${env}`;
const envPath = path.resolve(process.cwd(), envFile);

// Load environment file if it exists
if (fs.existsSync(envPath)) {
  console.log(`🔧 Loading environment: ${envFile}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`⚠️ Environment file ${envFile} not found. Falling back to process.env`);
}


import { createDataSource } from '../src/data/ormconfig';

const AppDataSource = createDataSource();

export default AppDataSource;