import { ScopeService, CryptoCryptographyService } from "app-framework";
import { AuthAppJwtService } from '@auth/shared/infrastructure/auth/jwt-service';
import { KeyCacheService } from '@auth/features/auth/infrastructure/jwt/key-cache.service';
import { JwksController } from '@auth/features/auth/infrastructure/http/jwks-controller';
import { JwksService } from '@auth/features/auth/domain/services/jwks-service';

export function buildJwksController() {
  // 1. Infrastructure

  const scopeService = new ScopeService()
  const jwtService = new AuthAppJwtService(new KeyCacheService())
  const keyCacheService = new KeyCacheService()
  const cryptoService = new CryptoCryptographyService()
  const jwksService = new JwksService(cryptoService)
  // 2. Domain services

  // 3. Application service
  
  // 4. Controller
  return new JwksController(
    jwtService,
    scopeService,
    jwksService,
    keyCacheService
  );
}
