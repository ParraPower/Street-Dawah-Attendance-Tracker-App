import { Response, NextFunction } from 'express';
import { verifyJwt } from '../../security/jwt';
import { hasScopes, parseScopeStringFromJWT, ScopeList } from './scopes';
import { UserJwtPayload } from '@/core/requests/userJwtPayload.dto';
import { RequestWithUser } from '@/core/requests/request-with-user';
// import { AppDataSource } from '../../config/ormconfig';
// import { TokenBlacklist } from '../../domains/tokens/token-blacklist-entity';

export async function authenticate(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {

    verifyJwt(token, (err, decoded) => {
      if (err) {
        throw err;
      }
      (req as RequestWithUser).user = decoded;
    });
    // const repo = AppDataSource.getRepository(TokenBlacklist);
    // const blacklisted = await repo.findOne({ where: { jti: payload.jti } });

    // if (blacklisted) {
    //   return res.status(401).json({ error: 'Token revoked' });
    // }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

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