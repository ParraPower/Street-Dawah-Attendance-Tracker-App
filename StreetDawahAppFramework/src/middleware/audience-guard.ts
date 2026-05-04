import { Response, NextFunction } from 'express';
import { JwtPayload } from '../auth/types/jwt.types';
import { RequestWithUser } from '../http/request-with-user';

/**
 * Ensures the JWT contains the required audience.
 * Works with both string and string[] audience formats.
 */
export function requireAudience(requiredAudience: string) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const payload = req.user as JwtPayload | undefined;

    if (!payload) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const tokenAud = payload.aud;

    let isValid = false;

    if (typeof tokenAud === 'string') {
      isValid = tokenAud === requiredAudience;
    } else if (Array.isArray(tokenAud)) {
      isValid = tokenAud.includes(requiredAudience);
    }

    if (!isValid) {
      return res.status(403).json({
        error: `Invalid audience. Expected "${requiredAudience}".`
      });
    }

    next();
  };
}
