import { NotFoundError } from '@auth/shared/infrastructure/middleware/global-error-handler';
import { UserOnboardingFlags } from '../../domain/enums/user-onboarding-flags';
import { IUserRepository } from '../../domain/repositories/iuser-repository';
import { UserService } from '../../domain/services/user-service';

export interface GetUserActivationStatusInput {
  userId: number;
}

export interface UserActivationStatus {
  isActive: boolean;
  hasCompletedOnboarding: boolean;
  missingFlags: UserOnboardingFlags[];
}

export class GetUserActivationStatusUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly repo: IUserRepository,
  ) {}

  async execute({ userId }: GetUserActivationStatusInput): Promise<UserActivationStatus> {
    const user = await this.repo.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.userService.getActivationStatus(user);
  }
}
