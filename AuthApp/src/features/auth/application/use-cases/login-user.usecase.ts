
import { UserTokenResponseDto } from "../dtos/token-response.dto";
import { mapper } from "@/mapping/mapper";
import { UserEntity } from "@/features/users/domain/entities/user-entity";
import { IUserRepository } from "@/features/users/domain/repositories/iuser-repository";
import { IHasherService } from "../../domains/services/hasher-service";
import { AuthService } from "../../domains/services/auth-service";
import { UserDto } from "@/dtos/user/user.dto";


export class LoginUserUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly hashService: IHasherService,
    private readonly authService: AuthService,
  ) { }

  async execute(email: string, password: string): Promise<UserTokenResponseDto | null> {
    let user: UserEntity | null = new UserEntity();
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_FAKE_LOGIN === 'true') {
      Object.assign(user, {
        id: 'some-uuid',
        email: email,
        username: 'testuser',
        passwordHash: await this.hashService.generateHashWithSize('password123', 12),
        scopes: ['user-read', 'user-write'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    else {
      user = await this.repo.findByEmail(email);
    }
    if (!user) throw new Error('Invalid credentials');

    const ok = await this.hashService.verify(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    const access = this.authService.signAccessToken(user.id.toString(), user.scopes);
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
