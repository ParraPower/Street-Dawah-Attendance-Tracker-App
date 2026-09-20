import { IUserRepository } from "@auth/features/users/domain/repositories/iuser-repository";
import { UserOnboardingFlags } from "@auth/features/users/domain/enums/user-onboarding-flags";
import { UserService } from "@auth/features/users/domain/services/user-service";
import {
  NotFoundError,
  ValidationError,
} from "@auth/shared/infrastructure/middleware/global-error-handler";

import { IHasherService } from "app-framework";

import { IEmailVerificationRepository } from "../../domain/repositories/iemail-verification-repository";
import { IEmailService } from "../../infrastructure/email/email.service";

export class SendEmailVerificationCodeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly hasherService: IHasherService,
    private readonly emailService: IEmailService,
    private readonly userService: UserService
  ) { }

  async execute(
    userId: number,
  ): Promise<void> {
    const user =
      await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(
        "User not found",
      );
    }

    if (!user.email) {
      throw new ValidationError(
        "User does not have an email address",
      );
    }

    if (
      this.userService.hasOnboardingFlag(
        user,
        UserOnboardingFlags.EmailVerified,
      )
    ) {
      throw new ValidationError(
        "Email already verified",
      );
    }

    const latestVerification =
      await this.emailVerificationRepository
        .findLatestByUserId(user.id);

    if (
      latestVerification &&
      Date.now() -
      latestVerification.createdAt.getTime() <
      60_000
    ) {
      throw new ValidationError(
        "Please wait before requesting another verification code",
      );
    }

    const activeVerification =
      await this.emailVerificationRepository
        .findLatestActiveByUserId(user.id);

    if (activeVerification) {
      await this.emailVerificationRepository.update(
        activeVerification.id,
        {
          invalidatedAt: new Date(),
        },
      );
    }

    const verificationCode =
      Math.floor(
        100000 +
        Math.random() * 900000,
      ).toString();

    const codeHash =
      await this.hasherService.generate(
        verificationCode,
      );

    await this.emailVerificationRepository.create({
      userId: user.id,
      codeHash,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000,
      ),
    });

    await this.emailService.send({
      to: user.email,
      subject: "Verify Your Email Address",
      html: `
        <html>
          <body>
            <p>
              Your email verification code is:
              <strong>${verificationCode}</strong>
            </p>
          </body>
        </html>
      `,
    });
  }
}