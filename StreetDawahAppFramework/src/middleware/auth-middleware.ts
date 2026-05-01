import { Response, NextFunction } from 'express';
import { ScopeList } from '../auth/policies/scope-types'
import { UserJwtPayload } from '../http/user-jwt-payload.dto';
import { RequestWithUser } from '../http/request-with-user';
import { ScopeService } from '../auth/services/scope-service';
import { IJwtService } from '../auth/interfaces/jwt-service';

export const authenticate = (jwtKeyService: IJwtService) => (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {

    jwtKeyService.verifyJwt(token, (err, decoded) => {
      if (err) {
        throw err;
      }
      (req as RequestWithUser).user = decoded;
    });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export const authorize = (scopeService: ScopeService, requiredScopes: ScopeList) => (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userJwtPayload = req.user as UserJwtPayload

    if (!userJwtPayload)
      throw new Error("user for authorization not assigned");

    const scopeList = scopeService.parseScopeStringFromJWT(userJwtPayload);

    if (!scopeList.length)
      throw new Error("invalid scope for user assigned");

    // Check if user has ALL required scopes
    if (!scopeService.hasScopes(scopeList, requiredScopes)) {
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