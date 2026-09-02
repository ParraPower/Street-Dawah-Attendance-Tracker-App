import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDawahDays1780000008000 implements MigrationInterface {
  name = "AddDawahDays1780000008000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "dawah_days" ("id" SERIAL NOT NULL, "dayOfWeek" smallint NOT NULL, "name" character varying(255) NOT NULL, "active" boolean NOT NULL DEFAULT false, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_dawah_days_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_dawah_days_day_of_week" ON "dawah_days" ("dayOfWeek")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dawah_days_day_of_week_active" ON "dawah_days" ("dayOfWeek") WHERE "active" = true AND "isDeleted" IS NOT TRUE`);
    await queryRunner.query(`INSERT INTO "dawah_days" ("dayOfWeek", "name", "active") VALUES (0, 'Sunday', true), (1, 'Monday', false), (2, 'Tuesday', false), (3, 'Wednesday', false), (4, 'Thursday', true), (5, 'Friday', false), (6, 'Saturday', true)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_dawah_days_day_of_week_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dawah_days_day_of_week"`);
    await queryRunner.query(`DROP TABLE "dawah_days"`);
  }
}
