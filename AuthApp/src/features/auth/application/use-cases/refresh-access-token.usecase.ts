import { IUserRepository } from "@auth/features/users/domain/repositories/iuser-repository";
import { IAuthAppJwtService } from "../../domain/services/jwt-service";
import { UserService } from "@auth/features/users/domain/services/user-service";
import { mapper } from "@auth/shared/infrastructure/mapping/mapper";
import { UserDto } from "@auth/features/users/application/dtos/user.dto";
import { UserEntity } from "@auth/features/users/domain/entities/user-entity";
import { InvalidRefreshTokenError } from "@auth/shared/infrastructure/errors/auth-errors";
import { IssueTokenUseCase } from './issue-token.usecase';

export class RefreshAccessTokenUseCase {
  constructor(
    private readonly jwtService: IAuthAppJwtService,
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
    private readonly issueTokenUseCase: IssueTokenUseCase,
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; user: UserDto }> {
    // Verify the refresh token payload
    const payload = this.jwtService.verifyJwtSync(refreshToken) as any;
    
    if (!payload || payload.type !== 'refresh') {
      throw new InvalidRefreshTokenError('Invalid or expired refresh token');
    }

    // Extract user ID from token
    const userId = Number(payload.sub);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new InvalidRefreshTokenError('User not found');
    }

    if (!this.userService.isNotDeletedUser(user)) {
      throw new InvalidRefreshTokenError('User is not available');
    }

    const accessToken = this.issueTokenUseCase.execute({
      user,
      tokenType: 'access',
      profile: 'refresh-rotation',
    });
    const userDto = mapper.map(user, UserEntity, UserDto);

    return {
      accessToken: accessToken.token,
      user: userDto,
    };
  }
}