// src/modules/jwks/jwks.controller.ts
import { Router } from 'express';
import { getAllPublicKeys } from '../../../../security/key-cache';
import { JwksService } from '../../domain/services/jwks-service';

export const JwksController = Router();

const jwksService = new JwksService();

JwksController.get('/.well-known/jwks.json', (req, res) => {
  const keys = getAllPublicKeys();

  res.json({
    keys: Object.entries(keys).map(([kid, pub]) => {
      const x5c = jwksService.convertPEMToJWK(pub);  
      return {
        kid,
        alg: 'RS256',
        use: 'sig',
        kty: 'RSA',
        n: x5c.n,
        e: x5c.e,
      }
    })
  });
});

