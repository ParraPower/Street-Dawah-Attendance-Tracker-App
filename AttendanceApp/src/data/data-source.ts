//import { DataSource } from 'typeorm';
import { createDataSource } from 'app-framework'
import { UserEntity } from '../features/users/domain/entities/User';
import { env } from '../infrastructure/config/env';

// import { 
//   //UserEntities, 
//   //AttendanceEntities, 
//   //LocationEntities, 
//   //MembershipEntities, 
//   //SessionEntities, 
//   //OutreachEntities 
// } from '@/domains/entities-index';
//import { Membership } from '@/domains/membership/entities/membership';


console.log(__dirname + "/../migrations/*.ts")
console.log(process.cwd() + "/../migrations/*.ts")

const AppDataSource = createDataSource(env.db.url, [ UserEntity ] as never, __dirname + "/../migrations/*.ts")
export default AppDataSource;