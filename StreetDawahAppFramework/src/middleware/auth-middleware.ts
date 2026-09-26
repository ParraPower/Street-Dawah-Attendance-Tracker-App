import { Response, NextFunction } from 'express';
import { ScopeList } from '../auth/policies/scope-types'
import { UserJwtPayload } from '../http/user-jwt-payload.dto';
import { RequestWithUser } from '../http/request-with-user';
import { ScopeService } from '../auth/services/scope-service';
import { IJwtService } from '../auth/interfaces/jwt-service';
import { ILoginUserExtraClaims } from '@shared/auth/policies/login-user-extra-claims';

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


export enum AuthorizeHandleOnboardingUsers {
  DisallowThem = 0,
  AllowThem = 1,
  OnlyAllowThem = 2
}

export enum AuthorizeHandleInactiveUsers {
  DisallowThem = 0,
  AllowThem = 1,
  AllowThemDisallowOnboarding = 2,
}

function isLoggedInUser (jwtUserPayload: object) {
  return Object.keys(jwtUserPayload).indexOf('is_logged_in_user') > -1
}

export const authorize = (scopeService: ScopeService, requiredScopes: ScopeList, options?: {
  handleOnboardingUsers: AuthorizeHandleOnboardingUsers,
  handleInactiveUsers: AuthorizeHandleInactiveUsers
}) => (req: RequestWithUser, res: Response, next: NextFunction) => {
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

    if (options) {
      if (isLoggedInUser(userJwtPayload)) {
      const loggedInUser = req.user as ILoginUserExtraClaims
        if (!loggedInUser.is_active) {
          if (options.handleInactiveUsers === AuthorizeHandleInactiveUsers.DisallowThem || (options.handleInactiveUsers === AuthorizeHandleInactiveUsers.AllowThemDisallowOnboarding && userJwtPayload.is_onboarding))
            return res.status(403).json({
              error: "insufficient_scope",
              requiredScopes
            });
        }

        if (!loggedInUser.is_oboarded) {
          if (options.handleOnboardingUsers === AuthorizeHandleOnboardingUsers.DisallowThem)
            return res.status(403).json({
              error: "insufficient_scope",
              requiredScopes
            });
        }
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}