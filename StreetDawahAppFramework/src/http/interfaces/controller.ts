import { Router, RequestHandler } from 'express';
import { ScopeList } from '@shared/auth/policies/scope-types';

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

export interface IController {
  readonly router: Router;

  registerRoute(
    method: HttpMethod,
    path: string,
    handler: RequestHandler | RequestHandler[],
    options?: {
      authenticate?: boolean;
      authorizeScopes?: ScopeList;
      middleware?: RequestHandler | RequestHandler[];
    }
  ): void;
}