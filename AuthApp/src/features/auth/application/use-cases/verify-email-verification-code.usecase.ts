import { HandleOnboardingEventUseCase } from "@auth/features/users/application/use-cases/handle-onboarding-event.use-case";
import { IUserRepository } from "@auth/features/users/domain/repositories/iuser-repository";
import { IEmailVerificationRepository } from "../../domain/repositories/iemail-verification-repository";
import { OnboardingEventType } from "@auth/features/users/domain/types/onboarding-event.type";
import { NotFoundError, ValidationError } from "@auth/shared/infrastructure/middleware/global-error-handler";
import { IHasherService } from "app-framework";

//src\features\auth\application\use-cases\verify-email-verification-code.usecase.ts
export class VerifyEmailVerificationCodeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly handleOnboardingEventUseCase: HandleOnboardingEventUseCase,
    private readonly hasherService: IHasherService,
  ) { }

  async execute(
    userId: number,
    code: string,
  ): Promise<void> {
    const user =
      await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const verification =
      await this.emailVerificationRepository
        .findLatestActiveByUserId(userId);

    if (!verification) {
      throw new ValidationError(
        "No active verification code found",
      );
    }

    if (verification.expiresAt < new Date()) {
      await this.emailVerificationRepository.update(
        verification.id,
        {
          invalidatedAt: new Date(),
        },
      );

      throw new ValidationError(
        "Verification code has expired",
      );
    }

    const matches =
      await this.hasherService.verify(
        code,
        verification.codeHash,
      );

    if (!matches) {
      throw new ValidationError(
        "Invalid verification code",
      );
    }

    await this.emailVerificationRepository.update(
      verification.id,
      {
        consumedAt: new Date(),
      },
    );

    await this.handleOnboardingEventUseCase.execute({
      userId: user.id,
      event: OnboardingEventType.EmailVerified,
    });
  }
}