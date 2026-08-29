//import { DataSource } from 'typeorm';
import { createDataSource } from 'app-framework'
import { UserEntity } from '../features/users/domain/entities/user-entity';
import { LocationEntity } from '../features/locations/domain/entities/location-entity';
import { SessionEntity } from '../features/sessions/domain/entities/session-entity';
import { SessionOccurrenceEntity } from '../features/session-occurrences/domain/entities/session-occurrence-entity';
import { SessionAttendanceEntity } from '../features/session-attendance/domain/entities/session-attendance-entity';
import { MembershipEntity } from '../features/memberships/domain/entities/membership-entity';
import { UserMembershipEntity } from '../features/user-memberships/domain/entities/user-membership-entity';
import { DawahDayEntity } from '../features/dawah-days/domain/entities/dawah-day-entity';
import { EmirDateAvailabilityEntity } from '../features/emir-date-availabilities/domain/entities/emir-date-availability-entity';
import { EmirSessionPreferenceEntity } from '../features/emir-session-preferences/domain/entities/emir-session-preference-entity';
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

const AppDataSource = createDataSource(env.db.url, [UserEntity, LocationEntity, SessionEntity, SessionOccurrenceEntity, SessionAttendanceEntity, MembershipEntity, UserMembershipEntity, DawahDayEntity, EmirDateAvailabilityEntity, EmirSessionPreferenceEntity] as never, __dirname + "/../migrations/*.ts", { logging: false, synchronize: false })
export default AppDataSource;