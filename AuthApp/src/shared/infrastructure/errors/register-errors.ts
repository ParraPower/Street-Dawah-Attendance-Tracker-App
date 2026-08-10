import { createGlobalErrorHandler } from 'app-framework';
import { registerAuthErrors } from "@auth/features/auth/application/errors/profile";

export function registerErrors() {
  console.log('Registering Errors...');
  const authErrors = registerAuthErrors();
  return createGlobalErrorHandler(authErrors);
}