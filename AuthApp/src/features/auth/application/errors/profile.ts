import { ClientNotFoundError, InvalidClientCredentialsError, InvalidTokenError, InsufficientScopesError, UnsupportedGrantTypeError, InvalidRefreshTokenError } from "@auth/shared/infrastructure/errors/auth-errors";
import { ErrorHandlerEntry } from "app-framework";

export const registerAuthErrors = (): ErrorHandlerEntry[] => [
  { errorClass: ClientNotFoundError, statusCode: 404 },
  { errorClass: InvalidClientCredentialsError, statusCode: 401 },
  { errorClass: InvalidTokenError, statusCode: 401 },
  { errorClass: InsufficientScopesError, statusCode: 403 },
  { errorClass: UnsupportedGrantTypeError, statusCode: 400 },
  { errorClass: InvalidRefreshTokenError, statusCode: 401 },
]