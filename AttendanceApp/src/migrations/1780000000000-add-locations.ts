import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocations1780000000000 implements MigrationInterface {
  name = "AddLocations1780000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "postcode" character varying(20) NOT NULL, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_locations_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_locations_name_postcode" ON "locations" ("name", "postcode")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_locations_name_postcode"`);
    await queryRunner.query(`DROP TABLE "locations"`);
  }
}