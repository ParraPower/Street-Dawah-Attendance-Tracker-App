import { Request } from 'express';
import { UserJwtPayload } from '../http/user-jwt-payload.dto';
import { ILoginUserExtraClaims } from '@shared/auth/policies/login-user-extra-claims';

export interface RequestWithUser<
  P = any,
  ResBody = any,
  ReqBody = any | { error: string },
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: UserJwtPayload | UserJwtPayload & ILoginUserExtraClaims;
}
