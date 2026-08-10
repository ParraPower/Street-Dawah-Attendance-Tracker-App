import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionAttendances1780000004000 implements MigrationInterface {
  name = "AddSessionAttendances1780000004000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "session_attendances" ("id" SERIAL NOT NULL, "sessionOccurrenceId" integer NOT NULL, "userId" integer NOT NULL, "attended" boolean NOT NULL DEFAULT false, "arrivalTime" time, "departureTime" time, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_session_attendances_id" PRIMARY KEY ("id"), CONSTRAINT "FK_session_attendances_occurrence" FOREIGN KEY ("sessionOccurrenceId") REFERENCES "session_occurrences"("id") ON DELETE CASCADE, CONSTRAINT "FK_session_attendances_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE INDEX "IDX_session_attendances_user" ON "session_attendances" ("userId")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_session_attendances_occurrence_user" ON "session_attendances" ("sessionOccurrenceId", "userId") WHERE "isDeleted" IS NOT TRUE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_session_attendances_occurrence_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_session_attendances_user"`);
    await queryRunner.query(`DROP TABLE "session_attendances"`);
  }
}
