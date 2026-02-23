// src/types/express.d.ts
import { UserJwtPayload } from '@/core/requests/userJwtPayload.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

export {}
