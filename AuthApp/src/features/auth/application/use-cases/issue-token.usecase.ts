import { UserEntity } from '@auth/features/users/domain/entities/user-entity';
import { UserService } from '@auth/features/users/domain/services/user-service';
import { IAuthAppJwtService } from '@auth/features/auth/domain/services/jwt-service';
import { ValidationError } from '@auth/shared/infrastructure/middleware/global-error-handler';

export type IssueTokenRequest =
  | { user: UserEntity; tokenType: 'access'; profile: 'user' }
  | { user: UserEntity; tokenType: 'refresh'; profile: 'user' }
  | { user: UserEntity; tokenType: 'access'; profile: 'refresh-rotation' }
  | { user: UserEntity; tokenType: 'access'; profile: 'imported-registration' };

export class IssueTokenUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: IAuthAppJwtService,
  ) {}

  execute({ user, tokenType, profile }: IssueTokenRequest) {
    if (!this.userService.isNotDeletedUser(user)) {
      throw new ValidationError('User is not available');
    }

    let scopes = user.scopes ?? [];
    let extraClaims: Record<string, unknown> | undefined;

    if (profile === 'imported-registration') {
      if (!this.userService.isImportedMember(user)) {
        throw new ValidationError('User is not eligible for imported registration');
      }

      scopes = [];
      extraClaims = { imported: true };
    } else if (profile === 'refresh-rotation') {
      const activationStatus = this.userService.getActivationStatus(user);
      extraClaims = {
        active_member: activationStatus.isActive,
        onboarding_complete: activationStatus.hasCompletedOnboarding,
      };
    } else if (tokenType === 'access') {
      const activationStatus = this.userService.getActivationStatus(user);
      extraClaims = {
        is_logged_in_user: true,
        is_active: activationStatus.isActive,
        is_oboarded: activationStatus.hasCompletedOnboarding,
      };

      if (this.userService.isImportedMember(user)) {
        extraClaims.imported = true;
      }
    }

    return this.jwtService.signTokenWithExtraClaims(
      user.id.toString(),
      scopes,
      tokenType,
      undefined,
      extraClaims,
    );
  }
}