import { PasswordService } from "./password-service";
import _ from 'lodash'
import { isNotNullOrEmtpy } from "@auth/utils/strings";
import { IAuthAppJwtService } from "./jwt-service";

export class AuthService {
  constructor(private readonly jwtService: IAuthAppJwtService, private readonly passwordService: PasswordService) { }

  private signToken(userId: string, scopes: string[], type: 'access' | 'refresh', extraClaims?: Record<string, any>) {
    return this.jwtService.signTokenWithExtraClaims(userId, scopes, type, undefined, extraClaims);
  }

  signAccessToken(userId: string, scopes: string[], extraClaims?: Record<string, any>) {
    return this.signToken(userId, scopes, 'access', extraClaims);
  }

  signRefreshToken(userId: string, scopes: string[]) {
    return this.signToken(userId, scopes, 'refresh');
  }

  public generateTempPassword = (currentPassword?: string): string => {
     
    const needsGeneratedPassword =
      !isNotNullOrEmtpy(currentPassword) || !this.passwordService.isValidPassword(currentPassword);

    if (needsGeneratedPassword) {
      return this.passwordService.generateTempPassword();
    }

    return currentPassword!;
  }
}