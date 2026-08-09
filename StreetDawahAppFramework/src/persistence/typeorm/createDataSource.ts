import { DataSource } from 'typeorm';
import { EntitySchema, MixedList } from 'typeorm'

// Define a constructor type that produces a BaseEntity

export const createDataSource = 
(dbUrl: string, entities: MixedList<EntitySchema>, migrationsPath: string, options?: { logging: boolean, synchronize?: boolean }) => new DataSource({
  type: 'postgres',
  url: dbUrl,
  entities: entities,
  synchronize: options?.synchronize ?? false,
  logging: options?.logging,
  migrations: [migrationsPath],
})