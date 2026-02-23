import { RequestWithUser } from "./request-with-user";
import { RequestHandler } from "express";

export interface DawahRequestHandler<P = any, ResBody = any, ReqBody = any | { error: string }, ReqQuery = any> extends RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  (req: RequestWithUser<P, ResBody, ReqBody, ReqQuery>, res: any): any;
} 