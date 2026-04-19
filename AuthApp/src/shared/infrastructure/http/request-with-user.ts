import { Request } from 'express';
import { UserJwtPayload } from '@/shared/infrastructure/http/userJwtPayload.dto';

export interface RequestWithUser<
  P = any,
  ResBody = any,
  ReqBody = any | { error: string },
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: UserJwtPayload;
}