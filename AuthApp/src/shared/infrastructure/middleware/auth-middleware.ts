import { Response, NextFunction } from 'express';
import { ScopeList } from '@/features/auth/domain/policies/scope-types';

import { UserJwtPayload } from '@/shared/infrastructure/http/userJwtPayload.dto';
import { RequestWithUser } from '@/shared/infrastructure/http/request-with-user';
import { ScopeService } from '@/features/auth/domain/services/scope-service';
import { IJwtService } from '@/features/auth/domain/services/jwt-service';
// import { AppDataSource } from '../../config/ormconfig';
// import { TokenBlacklist } from '../../domains/tokens/token-blacklist-entity';

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