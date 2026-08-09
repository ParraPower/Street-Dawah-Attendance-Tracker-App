import { createMembershipProfile } from '../../features/memberships/application/mappers/membership-profile';
import { createMembershipMapper } from '../../features/memberships/application/mappers/membership.mapper';
import { createUserProfile } from '../../features/users/application/mappers/user-profile';
import { createImportUserProfile } from '../../features/import/application/mappers/import-user-profile';
import { createLocationProfile } from '../../features/locations/application/mappers/location.mapper';
import { createSessionProfile } from '../../features/sessions/application/mappers/session.mapper';
import { createSessionOccurrenceProfile } from '../../features/session-occurrences/application/mappers/session-occurrence.mapper';
import { createSessionAttendanceProfile } from '../../features/session-attendance/application/mappers/session-attendance.mapper';
import { createUserMembershipProfile } from '../../features/user-memberships/application/mappers/user-membership.mapper';

export function registerProfiles() {
  console.log('Registering Automapper profiles...');

  createMembershipProfile();
  createMembershipMapper();
  createUserProfile();
  createImportUserProfile();
  createLocationProfile();
  createSessionProfile();
  createSessionOccurrenceProfile();
  createSessionAttendanceProfile();
  createUserMembershipProfile();

  console.log('Automapper profiles registered.');
}

