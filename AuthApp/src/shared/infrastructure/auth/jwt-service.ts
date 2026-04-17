import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import { env } from '../config/env';
import { getPrivateKey, getPublicKey } from '../../../security/key-cache';
import { randomUUID } from 'crypto';
import { TokenType, JwtPayload } from '@/features/auth/domain/types/jwt.types';
import { IJwtService } from '@/features/auth/domain/services/jwt-service';

export class JwtService implements IJwtService {
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

  signJwt(payload: object, expiresIn: StringValue) {
    const { kid, key } = getPrivateKey();

    if (!key || typeof key !== 'string') {
      throw new Error('JWT private key not configured');
    }

    return jwt.sign(payload, key, {
      algorithm: 'RS256',
      expiresIn,
      keyid: kid,
    });
  }

  verifyJwt(token: string, action: (err: Error, decoded: never) => void): void {
    jwt.verify(token, (header, callback) => {
      //console.log("Verifying JWT...", header);
      if (header.kid === undefined) {
        return callback(new Error('No key ID in token header'));
      }
  
      const pub = getPublicKey(header.kid);
  
      if (!pub) return callback(new Error('Unknown key ID'));
      callback(null, pub);
    }, ( err, decoded) => {
      action(err as Error, decoded as never)});
  }
}
