import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserMemberships1780000006000 implements MigrationInterface {
  name = "AddUserMemberships1780000006000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_memberships" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "membershipId" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_user_memberships_id" PRIMARY KEY ("id"), CONSTRAINT "FK_user_memberships_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE, CONSTRAINT "FK_user_memberships_membership" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE INDEX "IDX_user_memberships_user" ON "user_memberships" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_memberships_membership" ON "user_memberships" ("membershipId")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_memberships_user_membership" ON "user_memberships" ("userId", "membershipId") WHERE "isDeleted" IS NOT TRUE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_user_memberships_user_membership"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_memberships_membership"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_memberships_user"`);
    await queryRunner.query(`DROP TABLE "user_memberships"`);
  }
}
