import { createMembershipProfile } from './profiles/membership-profile';

export function registerProfiles() {
  console.log('Registering Automapper profiles...');

  createMembershipProfile();

  console.log('Automapper profiles registered.');
}

