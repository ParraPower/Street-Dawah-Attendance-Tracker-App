import { ScopeService } from '@/features/auth/domain/services/scope-service';
import { AuthAppJwtService } from '@/shared/infrastructure/auth/jwt-service';
import { KeyCacheService } from '@/features/auth/infrastructure/jwt/key-cache.service';
import { JwksController } from '@/features/auth/infrastructure/http/jwks-controller';
import { JwksService } from '@/features/auth/domain/services/jwks-service';

export function buildJwksController() {
  // 1. Infrastructure

  const scopeService = new ScopeService()
  const jwtService = new AuthAppJwtService(new KeyCacheService())
  const keyCacheService = new KeyCacheService()
  const jwksService = new JwksService()
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
