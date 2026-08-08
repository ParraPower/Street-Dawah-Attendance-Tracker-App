import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessions1780000001000 implements MigrationInterface {
  name = "AddSessions1780000001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "locationId" integer NOT NULL, "dayOfWeek" smallint NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_sessions_id" PRIMARY KEY ("id"), CONSTRAINT "FK_sessions_location" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE INDEX "IDX_sessions_location_day" ON "sessions" ("locationId", "dayOfWeek")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_sessions_schedule" ON "sessions" ("locationId", "dayOfWeek", "startTime", "endTime") WHERE "isDeleted" IS NOT TRUE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_sessions_schedule"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_sessions_location_day"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}