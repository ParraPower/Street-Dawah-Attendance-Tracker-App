import { DataSource } from 'typeorm';
import { env } from './env';
import { UserEntity } from '@/domains/users/user-entity';
// import { TokenBlacklist } from '../domains/tokens/token-blacklist-entity';
//import { TokenWhitelist } from '../domains/tokens/token-whitelist-entity';
import { JwtKey } from '@/domains/keys/key-entity';
//import { getDirname } from 'utils/esm-globals';

console.log("ormconfig __dirname:", __dirname);

const createDataSource = () => new DataSource({
  type: 'postgres',
  url: env.db.url,
  entities: [
    UserEntity,//, TokenBlacklist, 
    //TokenWhitelist
    JwtKey
  ],
  synchronize: false, // true only in dev
  logging: false,
  migrations: [__dirname + "/../migrations/*.ts"],
})

export { createDataSource };

// const AppDataSource = ;

// export default AppDataSource;