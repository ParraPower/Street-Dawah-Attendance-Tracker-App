// src/types/express.d.ts
import { UserJwtPayload } from '@/shared/infrastructure/http/userJwtPayload.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

export {}
