import { StringValue } from 'ms';
import { env } from '../config/env';
import { randomUUID } from 'crypto';
import { TokenType, JwtPayload } from '@auth/features/auth/domain/types/jwt.types';
import { KeyCacheService } from '@auth/features/auth/infrastructure/jwt/key-cache.service';
import { IAuthAppJwtService } from '@auth/features/auth/domain/services/jwt-service';
import { JwtService } from 'app-framework'

export class AuthAppJwtService extends JwtService implements IAuthAppJwtService {
  constructor(keyCacheService: KeyCacheService) {
    super(keyCacheService)
  }

  signTokenWithExtraClaims(
    userId: string,
    scopes: string[],
    type: TokenType,
    audience?: string | string[],
    extraClaims?: Record<string, any>,
  ) {
    const jti = randomUUID();
    const expiresIn = (type === 'access' ? env.accessTokenTtl : env.refreshTokenTtl) as StringValue;

    const payload: any = {
      sub: userId,
      jti,
      scope: scopes.join(' '),
      aud: audience || env.jwtDefaultAudience,
      iss: env.jwtIssuer,
      type,
    } as JwtPayload;

    if (extraClaims && typeof extraClaims === 'object') {
      for (const [k, v] of Object.entries(extraClaims)) {
        // do not overwrite reserved jwt fields
        if (!['sub', 'jti', 'scope', 'aud', 'iss', 'type', 'exp', 'iat', 'nbf'].includes(k)) {
          payload[k] = v;
        }
      }
    }

    const token = this.signJwt(payload, expiresIn);

    return { token, jti, expiresIn };
  }
}
