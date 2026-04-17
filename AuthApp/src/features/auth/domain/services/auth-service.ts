import { PasswordService } from "./password-service";
import _ from 'lodash'
import { isNotNullOrEmtpy } from "@/utils/strings";
import { IJwtService } from "./jwt-service";

export class AuthService {
  constructor(private readonly jwtService: IJwtService, private readonly passwordService: PasswordService) { }

  private signToken(userId: string, scopes: string[], type: 'access' | 'refresh') {
    return this.jwtService.signToken(userId, scopes, type);
  }

  signAccessToken(userId: string, scopes: string[]) {
    return this.signToken(userId, scopes, 'access');
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