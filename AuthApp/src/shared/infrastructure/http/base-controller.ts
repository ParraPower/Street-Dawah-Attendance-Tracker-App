import { Router, RequestHandler } from 'express';
import { authenticate, authorize } from '@/shared/infrastructure/middleware/auth-middleware';
import { ScopeService } from '@/features/auth/domain/services/scope-service';
import { ScopeList } from '@/features/auth/domain/policies/scope-types';
import { asyncHandler } from '@/shared/infrastructure/middleware/async-handler';
import { HttpMethod, IController } from './controller.interface';
import { DawahRequestHandler } from '@/shared/infrastructure/http/dawah-request-handler';
import { IJwtService } from '@/features/auth/domain/services/jwt-service';

export abstract class BaseController implements IController {
  public readonly router = Router();

  protected constructor(protected readonly jwtService: IJwtService, protected readonly scopeService: ScopeService) {}

  public registerRoute(
    method: HttpMethod,
    path: string,
    handler: DawahRequestHandler | DawahRequestHandler[] | RequestHandler | RequestHandler[],
    options?: {
      authenticate?: boolean;
      authorizeScopes?: ScopeList;
      middleware?: RequestHandler | RequestHandler[];
    }
  ): void {
    const routeHandlers: RequestHandler[] = [];

    if (options?.authenticate ?? true) {
      routeHandlers.push(authenticate(this.jwtService));
    }

    if (options?.authorizeScopes?.length) {
      routeHandlers.push(authorize(this.scopeService, options.authorizeScopes));
    }

    if (options?.middleware) {
      routeHandlers.push(...(Array.isArray(options.middleware) ? options.middleware : [options.middleware]));
    }

    routeHandlers.push(...this.wrapHandlers(handler));

    (this.router as any)[method](path, ...routeHandlers);
  }

  private wrapHandlers(handler: RequestHandler | RequestHandler[]): RequestHandler[] {
    const handlers = Array.isArray(handler) ? handler : [handler];
    return handlers.map(h => asyncHandler(h));
  }
}