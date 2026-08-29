import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMembershipCodeAndSeed1780000011000 implements MigrationInterface {
  name = "AddMembershipCodeAndSeed1780000011000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" ADD COLUMN "code" character varying(4)`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_memberships_active_code" ON "memberships" ("code") WHERE "isDeleted" IS NOT TRUE`);
    await queryRunner.query(`INSERT INTO "memberships" ("name","membership_types_flag","code","isDeleted","createdAt","updatedAt","createdBy") VALUES
      ('New Brothers', 31, 'NWBR', false, now(), now(), 1),
      ('General', 30, 'GNRL', false, now(), now(), 1),
      ('Management Forum', 28, 'MNGT', false, now(), now(), 1),
      ('Team Leaders', 24, 'TMLD', false, now(), now(), 1),
      ('Shurah', 16, 'SHRH', false, now(), now(), 1)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "memberships" WHERE "code" IN ('NWBR','GNRL','MNGT','TMLD','SHRH')`);
    await queryRunner.query(`DROP INDEX "public"."UQ_memberships_active_code"`);
    await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "code"`);
  }
}
