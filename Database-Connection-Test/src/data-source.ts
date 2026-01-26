import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Use environment variable
  synchronize: true, // Auto-create tables (disable in production)
  logging: false,
  //entities: [User],
});
