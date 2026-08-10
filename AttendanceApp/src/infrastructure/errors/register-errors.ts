import { createGlobalErrorHandler } from 'app-framework';
import { registerImportErrors } from '@attendance/features/import/application/errors/profile';
import { SessionOccurrenceAuthorizationError } from '@attendance/features/session-occurrences/application/authorization/session-occurrence-authorization.service';

export function registerErrors() {
  console.log('Registering Errors...');
  
  const importErrors = registerImportErrors();
  return createGlobalErrorHandler([
    ...importErrors,
    { errorClass: SessionOccurrenceAuthorizationError, statusCode: 403 },
  ]);
}