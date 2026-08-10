import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActiveMembershipNameConstraint1780000005000 implements MigrationInterface {
  name = "AddActiveMembershipNameConstraint1780000005000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_memberships_active_name" ON "memberships" (LOWER("name")) WHERE "isDeleted" = false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_memberships_active_name"`);
  }
}