import { EmailVerificationEntity } from "../entities/email-verification-entity";

export interface IEmailVerificationRepository {
  create(
    verification: Partial<EmailVerificationEntity>
  ): Promise<EmailVerificationEntity>;

  invalidateOutstandingForUser(
    userId: number
  ): Promise<void>;

  findLatestByUserId(
    userId: number
  ): Promise<EmailVerificationEntity | null>;

  findLatestActiveByUserId(
    userId: number,
  ): Promise<EmailVerificationEntity | null>

  update(
    id: number,
    entity: Partial<EmailVerificationEntity>
  ): Promise<EmailVerificationEntity | null>;
}