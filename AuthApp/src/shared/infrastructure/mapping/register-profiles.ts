// src/mapping/register-profiles.ts
import { createJwtKeyProfile } from '@auth/features/auth/application/mappers/jwtkey-profile';
import { createClientProfile } from '@auth/features/clients/application/mappers/clients-profile';
import { createUserProfile } from '@auth/features/users/application/mappers/user-profile';
// import { createRoleProfile } from './profiles/role.profile';
// import { createTokenProfile } from './profiles/token.profile';

export function registerProfiles() {
  console.log('Registering Automapper profiles...');

  createUserProfile();
  createClientProfile();
  createJwtKeyProfile();
  // createRoleProfile();
  // createTokenProfile();

  console.log('Automapper profiles registered.');
}

