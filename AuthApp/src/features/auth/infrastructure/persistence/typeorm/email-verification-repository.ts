import { EmailVerificationEntity } from "@auth/features/auth/domain/entities/email-verification-entity";
import { IEmailVerificationRepository } from "@auth/features/auth/domain/repositories/iemail-verification-repository";
import { BaseRepository } from "app-framework"
import { Repository, IsNull } from "typeorm";

//src\features\auth\infrastructure\persistence\typeorm\email-verification-repository.ts
export class EmailVerificationRepository
  extends BaseRepository<EmailVerificationEntity>
  implements IEmailVerificationRepository {

  constructor(
    repo: Repository<EmailVerificationEntity>,
  ) {
    super(repo);
  }

  invalidateOutstandingForUser(userId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async findById(id: number) {
    return await this.repo.findOne({
      where: { id },
      order: { createdAt: "DESC" }
    });
  }

  async findLatestByUserId(
    userId: number,
  ): Promise<EmailVerificationEntity | null> {
    return await this.repo.findOne({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findLatestActiveByUserId(
    userId: number,
  ): Promise<EmailVerificationEntity | null> {
    return await this.repo.findOne({
      where: {
        userId,
        consumedAt: IsNull(),
        invalidatedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  

  async create(
    entity: Partial<EmailVerificationEntity>,
  ): Promise<EmailVerificationEntity> {
    const verification =
      this.repo.create(entity);

    return await this.repo.save(
      verification,
    );
  }

  async update(
    id: number,
    entity: Partial<EmailVerificationEntity>,
  ): Promise<EmailVerificationEntity | null> {

    const existing =
      await this.findById(id);

    if (!existing) {
      return null;
    }

    Object.assign(
      existing,
      entity,
    );

    return await this.repo.save(
      existing,
    );
  }
}

