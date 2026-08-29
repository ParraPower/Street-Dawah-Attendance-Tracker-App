import { MigrationInterface, QueryRunner } from "typeorm";

export class BackfillMembershipCodeAndSetNotNull1780000012000 implements MigrationInterface {
  name = "BackfillMembershipCodeAndSetNotNull1780000012000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Finally set NOT NULL constraint
    await queryRunner.query(`ALTER TABLE "memberships" ALTER COLUMN "code" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" ALTER COLUMN "code" DROP NOT NULL`);
  }
}
