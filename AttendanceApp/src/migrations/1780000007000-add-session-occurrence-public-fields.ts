import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionOccurrencePublicFields1780000007000 implements MigrationInterface {
  name = "AddSessionOccurrencePublicFields1780000007000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session_occurrences" ADD "showPublicly" boolean DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "session_occurrences" ADD "mainEmirUserId" integer DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "session_occurrences" ADD CONSTRAINT "FK_session_occurrences_main_emir_user" FOREIGN KEY ("mainEmirUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`CREATE INDEX "IDX_session_occurrences_main_emir_user" ON "session_occurrences" ("mainEmirUserId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_session_occurrences_main_emir_user"`);
    await queryRunner.query(`ALTER TABLE "session_occurrences" DROP CONSTRAINT "FK_session_occurrences_main_emir_user"`);
    await queryRunner.query(`ALTER TABLE "session_occurrences" DROP COLUMN "mainEmirUserId"`);
    await queryRunner.query(`ALTER TABLE "session_occurrences" DROP COLUMN "showPublicly"`);
  }
}