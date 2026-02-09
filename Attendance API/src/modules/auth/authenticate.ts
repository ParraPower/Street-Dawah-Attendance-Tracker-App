import { verifyAccessToken } from "@/core/modules/auth/verify-token.js";
import { UserJwtPayload } from "@/dtos/jwt/userJwtPayload.dto";
import { RequestWithUser } from "@/middleware/requestWithUser";
import { Response, NextFunction } from 'express';

export const authenticate = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction) => {
  
  console.log("Authenticating request...", req.headers, req.params, req.path, process.env.BYPASS_AUTHN);

  if (process.env.BYPASS_AUTHN === '1') {
    console.log("Bypassing authentication as per configuration");
    (req as RequestWithUser).user = { id: 'bypass-user', scope: "khaleef" } as UserJwtPayload;
    next();
    return;
  }

  console.log("Authentication middleware invoked");

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  console.log("Extracted token:", token);
  
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    verifyAccessToken(token, (err, payload) => {
      console.log("Token verification result:", err, payload);
      if (err) {
        throw err;
      }
      else {
        req.user = payload as any;
        next();
      }
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
