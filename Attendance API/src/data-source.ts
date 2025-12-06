import 'reflect-metadata';
import { User } from './domains/user/user-module.js';
import { Location } from './domains/location/location-module.js';
import { UserOutreachActivityLog } from './domains/outreach/outreach-module.js';
import { DataSource } from 'typeorm';
import { 
  //UserEntities, 
  //AttendanceEntities, 
  //LocationEntities, 
  //MembershipEntities, 
  //SessionEntities, 
  //OutreachEntities 
} from './domains/entities-index.js';
import * as dotenv from 'dotenv';
import { getDirname } from './utils/esm-globals.js';

// Dynamically load based on NODE_ENV or default to .env.local
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Use environment variable
  synchronize: true, // Auto-create tables (disable in production)
  logging: false,
  entities: [
    User,
    Location,
    UserOutreachActivityLog
    //...UserEntities, 
    //...LocationEntities,
    //...AttendanceEntities,
    //...OutreachEntities,
    //...MembershipEntities,
    //...SessionEntities
  ],
  migrations: [getDirname(import.meta.url) + "/migrations/*.ts"],
});

export default AppDataSource;

