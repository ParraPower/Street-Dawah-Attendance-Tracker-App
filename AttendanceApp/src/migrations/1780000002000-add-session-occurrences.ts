import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionOccurrences1780000002000 implements MigrationInterface {
  name = "AddSessionOccurrences1780000002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "session_occurrences" ("id" SERIAL NOT NULL, "sessionId" integer NOT NULL, "occurrenceDate" date NOT NULL, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_session_occurrences_id" PRIMARY KEY ("id"), CONSTRAINT "FK_session_occurrences_session" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_session_occurrences_session_date" ON "session_occurrences" ("sessionId", "occurrenceDate") WHERE "isDeleted" IS NOT TRUE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_session_occurrences_session_date"`);
    await queryRunner.query(`DROP TABLE "session_occurrences"`);
  }
}