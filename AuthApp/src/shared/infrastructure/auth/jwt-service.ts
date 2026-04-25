import { StringValue } from 'ms';
import { env } from '../config/env';
import { randomUUID } from 'crypto';
import { TokenType, JwtPayload } from '@auth/features/auth/domain/types/jwt.types';
import { KeyCacheService } from '@auth/features/auth/infrastructure/jwt/key-cache.service';
import { IAuthAppJwtService } from '@auth/features/auth/domain/services/jwt-service';
import { JwtService } from '@street-dawah/app-framework'

export class AuthAppJwtService extends JwtService implements IAuthAppJwtService {
  constructor(keyCacheService: KeyCacheService) {
    super(keyCacheService)
  }

  signToken(
    userId: string,
    scopes: string[],
    type: TokenType,
    audience?: string | string[],
  ) {
    const jti = randomUUID();
    const expiresIn = (type === 'access' ? env.accessTokenTtl : env.refreshTokenTtl) as StringValue;

    const payload: JwtPayload = {
      sub: userId,
      jti,
      scope: scopes.join(' '),
      aud: audience || env.jwtDefaultAudience,
      iss: env.jwtIssuer,
      type,
    };

    const token = this.signJwt(payload, expiresIn);

    return { token, jti, expiresIn };
  }
}
