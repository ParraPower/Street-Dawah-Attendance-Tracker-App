import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getPrivateKey, getPublicKey } from './key-cache';
import { randomUUID } from 'crypto';
import { ScopeString } from '@/modules/auth/scopes';

export type TokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;           // user ID
  jti: string;
  scope: ScopeString;         // space-separated: "user-read user-write"
  aud: string | string[];
  iss: string;
  type: TokenType;
}

export function signToken(
  userId: string,
  scopes: string[],
  type: TokenType,
  audience?: string | string[],
) {
  const jti = randomUUID();
  const expiresIn = type === 'access' ? env.accessTokenTtl : env.refreshTokenTtl;

  console.log('expiresIn:', expiresIn);

  const payload: JwtPayload = {
    sub: userId,
    jti,
    scope: scopes.join(' '),
    aud: audience || env.jwtDefaultAudience,
    iss: env.jwtIssuer,
    type,
  };

  const token = signJwt(payload, expiresIn);

  return { token, jti, expiresIn };
}

export function signJwt(payload: object, expiresIn: string) {
  const { kid, key } = getPrivateKey();

    if (!key || typeof key !== 'string')
    throw new Error('JWT private key not configured');

  return jwt.sign(payload, key, {
    algorithm: 'RS256',
    expiresIn: '1H',
    keyid: kid,
  });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, (header, callback) => {
    if (header.kid === undefined) {
      return callback(new Error('No key ID in token header'));
    }

    const pub = getPublicKey(header.kid);


    if (!pub) return callback(new Error('Unknown key ID'));
    callback(null, pub);
  });
}
