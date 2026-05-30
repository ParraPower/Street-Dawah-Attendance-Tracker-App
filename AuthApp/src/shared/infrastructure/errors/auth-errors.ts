import { GlobalError } from 'app-framework';

export class ClientNotFoundError extends GlobalError {
  constructor(clientName: string) {
    super(`Client not found: ${clientName}`);
  }
}

export class InvalidClientCredentialsError extends GlobalError {
  constructor(clientName: string) {
    super(`Invalid credentials for client: ${clientName}`);
  }
}

export class InvalidTokenError extends GlobalError {
  constructor(message = 'Invalid or expired token') {
    super(message);
  }
}

export class InsufficientScopesError extends GlobalError {
  constructor(requiredScopes: string[]) {
    super(`Insufficient scopes: ${requiredScopes.join(', ')}`);
  }
}

export class UnsupportedGrantTypeError extends GlobalError {
  constructor(grantType: string) {
    super(`Unsupported grant_type: ${grantType}`);
  }
}

export class InvalidRefreshTokenError extends GlobalError {
  constructor(message = 'Invalid or expired refresh token') {
    super(message);
  }
}