//import { DataSource } from 'typeorm';
import { createDataSource } from 'app-framework'
import { UserEntity } from '../features/users/domain/entities/user-entity';
import { LocationEntity } from '../features/locations/domain/entities/location-entity';
import { SessionEntity } from '../features/sessions/domain/entities/session-entity';
import { SessionOccurrenceEntity } from '../features/session-occurrences/domain/entities/session-occurrence-entity';
import { SessionAttendanceEntity } from '../features/session-attendance/domain/entities/session-attendance-entity';
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

const AppDataSource = createDataSource(env.db.url, [UserEntity, LocationEntity, SessionEntity, SessionOccurrenceEntity, SessionAttendanceEntity] as never, __dirname + "/../migrations/*.ts", { logging: true, synchronize: false })
export default AppDataSource;