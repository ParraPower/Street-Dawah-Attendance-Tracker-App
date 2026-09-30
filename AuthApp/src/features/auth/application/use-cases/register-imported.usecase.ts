import { ValidationError } from '@auth/shared/infrastructure/middleware/global-error-handler';
import { IHasherService } from '../../domain/services/hasher-service';
import { IUserRepository } from '@auth/features/users/domain/repositories/iuser-repository';
import { UserService } from '@auth/features/users/domain/services/user-service';
import { mapper } from '@auth/shared/infrastructure/mapping/mapper';
import { UserEntity } from '@auth/features/users/domain/entities/user-entity';
import { RegisterUserResponseDto } from '../dtos/register-user.dto';
import { ExchangeTokenUseCase } from './exchange-token.usecase';

export class RegisterImportedUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly hashService: IHasherService,
    private readonly userService: UserService,
    private readonly exchangeTokenUseCase: ExchangeTokenUseCase,
  ) {}

  async execute(userId: number, email: string, username: string, password: string, accessToken: string) {
    const user = await this.repo.findById(userId);

    if (!user || !this.userService.isImportedMember(user) || this.userService.hasCompletedOnboarding(user)) {
      throw new ValidationError('Invalid imported registration token');
    }

    const passwordHash = await this.hashService.generate(password);
    const updatedUser = await this.repo.update(user.id, {
      email: email?.toLowerCase(),
      username: username?.toLowerCase(),
      passwordHash,
      temporaryPasswordGuid: null,
    });

    if (!updatedUser) {
      throw new ValidationError('Invalid imported registration token');
    }

    const token = await this.exchangeTokenUseCase.execute(accessToken);

    return {
      ...mapper.map(updatedUser, UserEntity, RegisterUserResponseDto),
      ...token,
    };
  }
}
