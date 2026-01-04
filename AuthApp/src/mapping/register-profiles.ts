// src/mapping/register-profiles.ts
import { createUserProfile } from './profiles/user-profile';
// import { createRoleProfile } from './profiles/role.profile';
// import { createTokenProfile } from './profiles/token.profile';

export function registerProfiles() {
  console.log('Registering Automapper profiles...');

  createUserProfile();
  // createRoleProfile();
  // createTokenProfile();

  console.log('Automapper profiles registered.');
}

