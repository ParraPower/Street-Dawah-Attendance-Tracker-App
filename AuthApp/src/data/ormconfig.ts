import { DataSource } from 'typeorm';
import { env } from '@auth/shared/infrastructure/config/env';
import { UserEntity } from '@auth/features/users/domain/entities/user-entity';
// import { TokenBlacklist } from '../domains/tokens/token-blacklist-entity';
//import { TokenWhitelist } from '../domains/tokens/token-whitelist-entity';
import { JwtKey } from '@auth/features/auth/domain/entities/key-entity';
import { ClientEntity } from '@auth/features/clients/domains/entities/client-entity';

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