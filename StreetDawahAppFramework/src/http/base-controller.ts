import { Router, RequestHandler } from 'express';
import { authenticate, authorize } from '@/middleware/auth-middleware';
import { ScopeService } from '@/auth/services/scope-service';
import { ScopeList } from '@/auth/policies/scope-types';
import { asyncHandler } from '@/middleware/async-handler';
import { HttpMethod, IController } from './interfaces/controller';
import { DawahRequestHandler } from '@/http/dawah-request-handler';
import { IJwtService } from '@/auth/interfaces/jwt-service';
import { requireAudience } from '@/middleware/audience-guard';


export abstract class BaseController implements IController {
  public readonly router = Router();

  protected constructor(protected readonly jwtService: IJwtService, protected readonly scopeService: ScopeService, private readonly controllerConfig: {
    jwtDefaultAudience: string;
  }) {}

  public registerRoute(
    method: HttpMethod,
    path: string,
    handler: DawahRequestHandler | DawahRequestHandler[] | RequestHandler | RequestHandler[],
    options?: {
      authenticate?: boolean;
      authorizeScopes?: ScopeList;
      requiredAudience?: string;
      middleware?: RequestHandler | RequestHandler[];
    }
  ): void {
    const routeHandlers: RequestHandler[] = [];

    const shouldAuthenticate = (options?.authenticate ?? true) || Boolean(options?.requiredAudience) || Boolean(options?.authorizeScopes?.length);

    if (shouldAuthenticate) {
      routeHandlers.push(authenticate(this.jwtService));
    }

    if (options?.requiredAudience) {
      routeHandlers.push(requireAudience(options.requiredAudience));
    }
    else if (shouldAuthenticate) {
      routeHandlers.push(requireAudience(this.controllerConfig.jwtDefaultAudience))
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