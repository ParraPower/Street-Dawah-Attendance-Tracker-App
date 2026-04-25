// src/types/express.d.ts
import { UserJwtPayload } from '@auth/shared/infrastructure/http/userJwtPayload.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

export {}
