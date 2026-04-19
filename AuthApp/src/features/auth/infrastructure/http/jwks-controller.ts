import { Router } from 'express';
import { JwksService } from '../../domain/services/jwks-service';
import { BaseController } from '@/shared/infrastructure/http/base-controller';
import { ScopeService } from '@/features/auth/domain/services/scope-service';
import { IAuthAppJwtService } from '@/features/auth/domain/services/jwt-service';
import { DawahRequestHandler } from '@/shared/infrastructure/http/dawah-request-handler';
import { KeyCacheService } from '../jwt/key-cache.service';

export class JwksController extends BaseController {
  public readonly router = Router();

  constructor(
    protected readonly jwtService: IAuthAppJwtService,
    protected readonly scopeService: ScopeService,
    private readonly jwksService: JwksService,
    private readonly keyCacheService: KeyCacheService
    
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: ''});

    this.registerRoute('get', '/.well-known/jwks.json', this.getJwks, {
      authenticate: false,
    });
  }

  public getJwks: DawahRequestHandler = async (req, res) => {
    const keys = this.keyCacheService.getAllPublicKeys();

    res.json({
      keys: Object.entries(keys).map(([kid, pub]) => {
        const x5c = this.jwksService.convertPEMToJWK(pub);
        return {
          kid,
          alg: 'RS256',
          use: 'sig',
          kty: 'RSA',
          n: x5c.n,
          e: x5c.e,
        };
      }),
    });
  };
}