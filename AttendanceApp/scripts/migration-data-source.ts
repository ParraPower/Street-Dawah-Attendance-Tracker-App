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

import { createDataSource } from "app-framework";
import { UserEntity } from '../src/features/users/domain/entities/user-entity'
import { LocationEntity } from '../src/features/locations/domain/entities/location-entity'
import { SessionEntity } from '../src/features/sessions/domain/entities/session-entity'
import { SessionOccurrenceEntity } from '../src/features/session-occurrences/domain/entities/session-occurrence-entity'
import { SessionAttendanceEntity } from '../src/features/session-attendance/domain/entities/session-attendance-entity'

console.log(__dirname + "/../migrations/*.ts")

const AppDataSource = createDataSource(process.env.DB_URL!, [ UserEntity, LocationEntity, SessionEntity, SessionOccurrenceEntity, SessionAttendanceEntity ] as never, __dirname + "/../src/migrations/*.ts");

export default AppDataSource;