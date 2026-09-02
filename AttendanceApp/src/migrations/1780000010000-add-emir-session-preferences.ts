import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmirSessionPreferences1780000010000 implements MigrationInterface {
  name = "AddEmirSessionPreferences1780000010000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "emir_session_preferences" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "sessionId" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_emir_session_preferences_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "emir_session_preferences" ADD CONSTRAINT "FK_emir_session_preferences_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "emir_session_preferences" ADD CONSTRAINT "FK_emir_session_preferences_session" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE`);
    await queryRunner.query(`CREATE INDEX "IDX_emir_session_preferences_user_id" ON "emir_session_preferences" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_emir_session_preferences_session_id" ON "emir_session_preferences" ("sessionId")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_emir_session_preferences_user_session" ON "emir_session_preferences" ("userId", "sessionId") WHERE "isDeleted" IS NOT TRUE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_emir_session_preferences_user_session"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_emir_session_preferences_session_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_emir_session_preferences_user_id"`);
    await queryRunner.query(`ALTER TABLE "emir_session_preferences" DROP CONSTRAINT "FK_emir_session_preferences_session"`);
    await queryRunner.query(`ALTER TABLE "emir_session_preferences" DROP CONSTRAINT "FK_emir_session_preferences_user"`);
    await queryRunner.query(`DROP TABLE "emir_session_preferences"`);
  }
}
