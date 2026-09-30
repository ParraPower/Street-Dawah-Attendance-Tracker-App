import { Router } from 'express';
import { ScopeService } from 'app-framework';
import { BaseController } from '@auth/shared/infrastructure/http/base-controller';
import { DawahRequestHandler } from '@auth/shared/infrastructure/http/dawah-request-handler';
import { Scopes } from '@auth/features/auth/domain/policies/scope-types';
import { IAuthAppJwtService } from '@auth/features/auth/domain/services/jwt-service';
import { env } from '@auth/shared/infrastructure/config/env';
import { ExchangeTokenResponse, ExchangeTokenUseCase } from '../../../application/use-cases/exchange-token.usecase';

export class InternalAuthController extends BaseController {
  public readonly router = Router();

  constructor(
    protected readonly jwtService: IAuthAppJwtService,
    protected readonly scopeService: ScopeService,
    private readonly exchangeTokenUseCase: ExchangeTokenUseCase,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.jwtDefaultAudience });

    this.registerRoute('post', '/exchange-token', this.exchangeToken, {
      authenticate: true,
      authorizeScopes: [Scopes.Khaleef],
    });
  }

  public exchangeToken: DawahRequestHandler<
    Record<string, never>,
    ExchangeTokenResponse,
    { accessToken: string }
  > = async (req, res) => {
    const accessToken = req.body?.accessToken;
    if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
      return res.status(400).json({ message: 'Invalid accessToken' });
    }

    const token = await this.exchangeTokenUseCase.execute(accessToken);
    res.json(token);
  };
}