import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Attendance, Location, Membership, Session, User, UserMembership } from './entities/index.js';
import * as dotenv from 'dotenv';
import { getDirname } from './utils/esm-globals.js';

// Dynamically load based on NODE_ENV or default to .env.local
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Use environment variable
  synchronize: true, // Auto-create tables (disable in production)
  logging: false,
  entities: [Attendance, Location, Membership, Session, User, UserMembership],
  migrations: [getDirname(import.meta.url) + "/migrations/*.ts"],
});

export default AppDataSource;

