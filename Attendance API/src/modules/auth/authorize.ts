import { Request, Response, NextFunction } from 'express';
import { UserJwtPayload } from '@/modules/jwt/userJwtPayload.dto';
import { hasScopes, parseScopeStringFromJWT, ScopeList } from './scopes';

type RequestWithUser = Request & { user?: UserJwtPayload };

export const authorize = (requiredScopes: ScopeList) => (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userJwtPayload = req.user as UserJwtPayload
    if (!userJwtPayload)
      throw new Error("user for authorization not assigned");

    const scopeList = parseScopeStringFromJWT(userJwtPayload);

    if (!scopeList.length)
      throw new Error("invalid scope for user assigned");

    // Check if user has ALL required scopes
    if (!hasScopes(scopeList, requiredScopes)) {
        return res.status(403).json({
        error: "insufficient_scope",
        requiredScopes
      });

    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}