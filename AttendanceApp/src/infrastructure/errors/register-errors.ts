import { createGlobalErrorHandler } from 'app-framework';
import { registerImportErrors } from '@attendance/features/import/application/errors/profile';

export function registerErrors() {
  console.log('Registering Errors...');
  
  const importErrors = registerImportErrors();
  return createGlobalErrorHandler(importErrors);
}