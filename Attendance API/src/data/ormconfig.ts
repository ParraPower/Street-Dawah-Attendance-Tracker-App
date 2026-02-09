import { DataSource } from 'typeorm';
import { env } from '@/config/env';
import { User } from '@/domains/user/entities/user';

import { 
  //UserEntities, 
  //AttendanceEntities, 
  //LocationEntities, 
  //MembershipEntities, 
  //SessionEntities, 
  //OutreachEntities 
} from '@/domains/entities-index';
import { Membership } from '@/domains/membership/entities/membership';

const createDataSource = () => new DataSource({
  type: 'postgres',
  url: env.db.url, // Use environment variable
  entities: [
    User,
    Membership
    //Location,
    //UserOutreachActivityLog
    //...UserEntities, 
    //...LocationEntities,
    //...AttendanceEntities,
    //...OutreachEntities,
    //...MembershipEntities,
    //...SessionEntities
  ],
  synchronize: false, // Auto-create tables (disable in production)
  logging: false,
  migrations: [__dirname + "/../migrations/*.ts"],
});

export { createDataSource };