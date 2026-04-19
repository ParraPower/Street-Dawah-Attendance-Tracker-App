import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import { randomUUID, UUID } from 'crypto';
import { TokenType, JwtPayload } from '@/auth/types/jwt.types';
import { IJwtService } from '@/auth/interfaces/jwt-service';
import crypto from "crypto"
import { KeyCacheService } from './key-cache.service';

export class JwtService implements IJwtService {
  constructor(private readonly keyCacheService: KeyCacheService) {

  }

  generateJwtKeyPair(): { kid: UUID, publicKey: string; privateKey: string; } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });

    return { kid: crypto.randomUUID(), publicKey, privateKey }
  }

  signToken(
    userId: string,
    scopes: string[],
    type: TokenType,
    expiresIn: StringValue,
    issuer: string,
    audience?: string | string[]
  ) {
    const jti = randomUUID();

    const payload: JwtPayload = {
      sub: userId,
    
      jti,
      scope: scopes.join(' '),
      aud: audience ?? [],
      iss: issuer,
      type,
    };

    const token = this.signJwt(payload, expiresIn);

    return { token, jti, expiresIn };
  }

  signJwt(payload: object, expiresIn: StringValue) {
    const { kid, key } = this.keyCacheService.getPrivateKey();

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
      if (header.kid === undefined) {
        return callback(new Error('No key ID in token header'));
      }

      const pub = this.keyCacheService.getPublicKey(header.kid);

      if (!pub) return callback(new Error('Unknown key ID'));
      callback(null, pub);
    }, (err, decoded) => {
      action(err as Error, decoded as never)
    });
  }
}
