
import { UserTokenResponseDto } from "../dtos/token-response.dto";
import { mapper } from "@auth/shared/infrastructure/mapping/mapper";
import { UserEntity } from "@auth/features/users/domain/entities/user-entity";
import { IUserRepository } from "@auth/features/users/domain/repositories/iuser-repository";
import { IHasherService } from "../../domain/services/hasher-service";
import { AuthService } from "../../domain/services/auth-service";
import { GetUserActivationStatusUseCase } from '@auth/features/users/application/use-cases/get-user-activation-status.use-case';
import { UserDto } from "../../../users/application/dtos/user.dto";
import { UserService } from "@auth/features/users/domain/services/user-service";
import { ValidationError } from "@auth/shared/infrastructure/middleware/global-error-handler";
import { ILoggedInUserExtraClaims } from "app-framework"

export class LoginUserUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly hashService: IHasherService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly getUserActivationStatusUseCase: GetUserActivationStatusUseCase,
  ) { }

  async execute(username: string, password: string): Promise<UserTokenResponseDto | null> {
    let user: UserEntity | null = new UserEntity();
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_FAKE_LOGIN === 'true') {
      Object.assign(user, {
        id: 'some-uuid',
        username: 'testuser',
        passwordHash: await this.hashService.generateWithSize('password123', 12),
        scopes: ['user-read', 'user-write'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    else {
      user = await this.repo.findByUsername(username);
    }
    if (!user) throw new ValidationError('Invalid credentials');

    if (!this.userService.isUserActive(user)) new ValidationError('Invalid credentials')

    const ok = await this.hashService.verify(password, user.passwordHash!);
    if (!ok) throw new ValidationError('Invalid credentials');

    let extraClaims: ILoggedInUserExtraClaims | undefined = undefined;
    const userIdNum = parseInt(user.id as any, 10);
    if (!Number.isNaN(userIdNum)) {
      try {
        const status = await this.getUserActivationStatusUseCase.execute({ userId: userIdNum });
        extraClaims = {
          is_logged_in_user: true,
          is_active: !!status.isActive,
          is_oboarded: !!status.hasCompletedOnboarding,
        };
      } catch (err) {
        // ignore claim enrichment failures
      }
    }

    const access = this.authService.signAccessToken(user.id.toString(), user.scopes, extraClaims);
    const refresh = this.authService.signRefreshToken(user.id.toString(), user.scopes);

    const userDto = mapper.map(user, Object.getPrototypeOf(user).constructor, UserDto);

    // const refreshEntity = this.tokenWhitelistRepo.create({
    //   jti: refresh.jti,
    //   userId: user.id,
    //   active: true,
    //   expiresAt: new Date(Date.now() + parseDuration(env.refreshTokenTtl)),
    // });
    // await this.tokenWhitelistRepo.save(refreshEntity);

    return {
      accessToken: access.token,
      accessTokenExpiresIn: access.expiresIn,
      refreshToken: refresh.token,
      refreshTokenExpiresIn: refresh.expiresIn,
      user: userDto,
    };
  }
}
