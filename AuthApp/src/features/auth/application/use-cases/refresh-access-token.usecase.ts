import { IUserRepository } from "@auth/features/users/domain/repositories/iuser-repository";
import { IAuthAppJwtService } from "../../domain/services/jwt-service";
import { AuthService } from "../../domain/services/auth-service";
import { UserService } from "@auth/features/users/domain/services/user-service";
import { GetUserActivationStatusUseCase } from '@auth/features/users/application/use-cases/get-user-activation-status.use-case';
import { mapper } from "@auth/shared/infrastructure/mapping/mapper";
import { UserDto } from "@auth/features/users/application/dtos/user.dto";
import { UserEntity } from "@auth/features/users/domain/entities/user-entity";
import { InvalidRefreshTokenError } from "@auth/shared/infrastructure/errors/auth-errors";

export class RefreshAccessTokenUseCase {
  constructor(
    private readonly jwtService: IAuthAppJwtService,
    private readonly authService: AuthService,
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
    private readonly getUserActivationStatusUseCase: GetUserActivationStatusUseCase,
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; user: UserDto }> {
    // Verify the refresh token payload
    const payload = this.jwtService.verifyJwtSync(refreshToken) as any;
    
    if (!payload || payload.type !== 'refresh') {
      throw new InvalidRefreshTokenError('Invalid or expired refresh token');
    }

    // Extract user ID from token
    const userId = payload.sub;
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new InvalidRefreshTokenError('User not found');
    }

    if (!this.userService.isUserActive(user)) {
      throw new InvalidRefreshTokenError('User is inactive');
    }

    // Enrich claims and issue new access token
    let extraClaims: Record<string, any> | undefined = undefined;
    const userIdNum = parseInt(user.id as any, 10);
    if (!Number.isNaN(userIdNum)) {
      try {
        const status = await this.getUserActivationStatusUseCase.execute({ userId: userIdNum });
        extraClaims = {
          active_member: !!status.isActive,
          onboarding_complete: !!status.hasCompletedOnboarding,
        };
      } catch (err) {
        // ignore claim enrichment failures
      }
    }

    // Issue new access token
    const accessToken = this.authService.signAccessToken(user.id.toString(), user.scopes, extraClaims);
    const userDto = mapper.map(user, UserEntity, UserDto);

    return {
      accessToken: accessToken.token,
      user: userDto,
    };
  }
}