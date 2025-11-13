import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import * as dotenv from 'dotenv';

// Dynamically load based on NODE_ENV or default to .env.local
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });
console.log("database_url: ", process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Use environment variable
  synchronize: true, // Auto-create tables (disable in production)
  logging: false,
  entities: [User],
  migrations: [__dirname + "/migrations/*.ts"],
});

export default AppDataSource;

