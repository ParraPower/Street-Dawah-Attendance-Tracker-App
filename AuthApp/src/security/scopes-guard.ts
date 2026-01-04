import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from './jwt';

export function requireScopes(required: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenPayload = req.user as JwtPayload | undefined;
    if (!tokenPayload) return res.status(401).json({ error: 'Unauthenticated' });

    const tokenScopes = (tokenPayload.scope || '').split(' ').filter(Boolean);
    const hasAll = required.every((s) => tokenScopes.includes(s));
    if (!hasAll) return res.status(403).json({ error: 'Insufficient scope' });

    next();
  };
}

