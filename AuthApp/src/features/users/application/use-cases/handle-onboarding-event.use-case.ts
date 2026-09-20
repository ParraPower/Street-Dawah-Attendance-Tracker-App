import { NotFoundError } from '@auth/shared/infrastructure/middleware/global-error-handler';
import { UserEntity } from '../../domain/entities/user-entity';
import { IUserRepository } from '../../domain/repositories/iuser-repository';
import { OnboardingFlagsService } from '../../domain/services/onboarding-flags.service';
import { OnboardingEventType } from '../../domain/types/onboarding-event.type';

//src\features\users\application\use-cases\handle-onboarding-event.use-case.ts
export interface HandleOnboardingEventInput {
  userId: number;
  event: OnboardingEventType;
}

export class HandleOnboardingEventUseCase {
  private readonly onboardingFlagsService = new OnboardingFlagsService();

  constructor(private readonly repo: IUserRepository) {}

  async execute({ userId, event }: HandleOnboardingEventInput): Promise<UserEntity> {
    const user = await this.repo.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const flag = this.onboardingFlagsService.getFlagForEvent(event);
    const nextFlags = BigInt(user.onboardingFlags ?? 0n) | BigInt(flag);

    const updatedUser = await this.repo.update(userId, {
      onboardingFlags: nextFlags,
    });

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }
}
