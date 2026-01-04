import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../security/jwt';
import { isValidScopeString, ScopeList } from './scopes';
// import { AppDataSource } from '../../config/ormconfig';
// import { TokenBlacklist } from '../../domains/tokens/token-blacklist-entity';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = verifyJwt(token);
    // const repo = AppDataSource.getRepository(TokenBlacklist);
    // const blacklisted = await repo.findOne({ where: { jti: payload.jti } });

    // if (blacklisted) {
    //   return res.status(401).json({ error: 'Token revoked' });
    // }

    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export const authorize = (requiredScopes: ScopeList) => (req: Request, res: Response, next: NextFunction) => {
  //return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new Error("user for authorization not assigned");

      if (!isValidScopeString(req.user.scope))
        throw new Error("invalid scope for user assigned");

      const userScopes = req.user.scope.split(",").map(s => s.trim());

      // Check if user has ALL required scopes
      const missing = requiredScopes.filter(s => !userScopes.includes(s));

      if (missing.length > 0) {
        return res.status(403).json({
          error: "insufficient_scope",
          missing
        });
      }

      next();
    } catch (err) {
      console.log("authorization error", err);
      return res.status(401).json({ error: "Invalid token" });
    }
  //};
}