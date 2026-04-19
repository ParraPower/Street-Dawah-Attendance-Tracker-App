import { DataSource } from 'typeorm';
import { env } from '@/shared/infrastructure/config/env';
import { UserEntity } from '@/features/users/domain/entities/user-entity';
// import { TokenBlacklist } from '../domains/tokens/token-blacklist-entity';
//import { TokenWhitelist } from '../domains/tokens/token-whitelist-entity';
import { JwtKey } from '@/features/auth/domain/entities/key-entity';
import { ClientEntity } from '@/features/clients/domains/entities/client-entity';

console.log("Creating data source with DB URL:", env.db.url);

const createDataSource = () => new DataSource({
  type: 'postgres',
  url: env.db.url,
  entities: [
    UserEntity,//, TokenBlacklist, 
    //TokenWhitelist
    JwtKey,
    ClientEntity
  ],
  synchronize: false, // true only in dev
  logging: false,
  migrations: [__dirname + "/../migrations/*.ts"],
})

export { createDataSource };