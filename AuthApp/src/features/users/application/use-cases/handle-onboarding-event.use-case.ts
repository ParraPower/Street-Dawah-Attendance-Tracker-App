import { NotFoundError } from '@auth/shared/infrastructure/middleware/global-error-handler';
import { IUserRepository } from '../../domain/repositories/iuser-repository';
import { OnboardingFlagsService } from '../../domain/services/onboarding-flags.service';
import { OnboardingEventType } from '../../domain/types/onboarding-event.type';

//src\features\users\application\use-cases\handle-onboarding-event.use-case.ts
export interface HandleOnboardingEventInput {
  userIds: number[];
  event: OnboardingEventType;
}

export class HandleOnboardingEventUseCase {
  private readonly onboardingFlagsService = new OnboardingFlagsService();

  constructor(private readonly repo: IUserRepository) {}

  async execute({ userIds, event }: HandleOnboardingEventInput): Promise<void> {
    const uniqueUserIds = [...new Set(userIds)];
    if (uniqueUserIds.length === 0) {
      throw new NotFoundError('User not found');
    }

    const flag = this.onboardingFlagsService.getFlagForEvent(event);
    const affectedUsers = await this.repo.addOnboardingFlagToUsers(uniqueUserIds, flag);
    if (affectedUsers !== uniqueUserIds.length) {
      throw new NotFoundError('User not found');
    }
  }
}
