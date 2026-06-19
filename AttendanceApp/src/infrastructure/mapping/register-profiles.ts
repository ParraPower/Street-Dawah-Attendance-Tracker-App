import { createMembershipProfile } from '../../features/memberships/application/mappers/membership-profile';
import { createUserProfile } from '../../features/users/application/mappers/user-profile';
import { createImportUserProfile } from '../../features/import/application/mappers/import-user-profile';

export function registerProfiles() {
  console.log('Registering Automapper profiles...');

  createMembershipProfile();
  createUserProfile();
  createImportUserProfile();

  console.log('Automapper profiles registered.');
}

