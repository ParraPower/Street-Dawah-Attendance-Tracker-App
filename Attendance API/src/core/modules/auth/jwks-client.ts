// src/security/jwks-client.ts
import jwksClient from 'jwks-rsa';
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';

export const client = jwksClient({
  jwksUri: `${process.env.AUTH_API_URL}/.well-known/jwks.json`,
  cache: true,                 // cache keys in memory
  cacheMaxEntries: 5,          // keep up to 5 keys
  cacheMaxAge: 10 * 60 * 1000, // 10 minutes
  rateLimit: true,             // avoid hammering your auth API
  jwksRequestsPerMinute: 10,
});

export function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  console.log("Fetching signing key for kid:", header.kid, process.env.AUTH_API_URL);
  client.getSigningKey(header.kid!, (err, key) => {
    if (err) {
      console.error('Error getting signing key:', err);
      return callback(err, undefined);
    }

    if (!key) {
      return callback(new Error('No signing key found'), undefined);
    }

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}
