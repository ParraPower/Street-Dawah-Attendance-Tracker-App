import { DataSource } from 'typeorm';
import { EntitySchema, MixedList } from 'typeorm'

// Define a constructor type that produces a BaseEntity

export const createDataSource = 
(dbUrl: string, entities: MixedList<EntitySchema>, migrationsPath: string) => new DataSource({
  type: 'postgres',
  url: dbUrl,
  entities: entities,
  synchronize: false, // true only in dev
  logging: false,
  migrations: [migrationsPath],
})