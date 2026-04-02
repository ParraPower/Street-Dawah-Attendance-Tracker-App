import { signToken } from "@/security/jwt";

export class AuthService {
  constructor() {}

  private signToken(userId: string, scopes: string[], type: 'access' | 'refresh') {
    return signToken(userId, scopes, type);
  }

  signAccessToken(userId: string, scopes: string[]) {
    return this.signToken(userId, scopes, 'access');
  }

  signRefreshToken(userId: string, scopes: string[]) {
    return this.signToken(userId, scopes, 'refresh');
  }
}