import { JwtPayload } from 'jsonwebtoken';

export interface UserJwtPayload extends JwtPayload {
  scope: string;
  is_onboarding: boolean,
  is_inactive: boolean,
}
