// src/security/verify-token.ts
import jwt from 'jsonwebtoken';
import { getKey } from './jwks-client';

export function verifyAccessToken(token: string, action: (err: Error, decoded: never) => void): void {
  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"], // JWKS always implies asymmetric keys
      issuer: process.env.TOKEN_ISSUER, // optional but recommended
      audience: process.env.TOKEN_AUDIENCE, // optional but recommended
    },
    (err, decoded) => {
      action(err as Error, decoded as never);
    }

  )
}

