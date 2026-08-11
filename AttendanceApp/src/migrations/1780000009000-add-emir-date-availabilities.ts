import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmirDateAvailabilities1780000009000 implements MigrationInterface {
  name = "AddEmirDateAvailabilities1780000009000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "emir_date_availabilities" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "availabilityDate" date NOT NULL, "active" boolean NOT NULL DEFAULT true, "isDeleted" boolean, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_emir_date_availabilities_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "emir_date_availabilities" ADD CONSTRAINT "FK_emir_date_availabilities_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
    await queryRunner.query(`CREATE INDEX "IDX_emir_date_availabilities_user_id" ON "emir_date_availabilities" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_emir_date_availabilities_date" ON "emir_date_availabilities" ("availabilityDate")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_emir_date_availabilities_user_date" ON "emir_date_availabilities" ("userId", "availabilityDate") WHERE "isDeleted" IS NOT TRUE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_emir_date_availabilities_user_date"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_emir_date_availabilities_date"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_emir_date_availabilities_user_id"`);
    await queryRunner.query(`ALTER TABLE "emir_date_availabilities" DROP CONSTRAINT "FK_emir_date_availabilities_user"`);
    await queryRunner.query(`DROP TABLE "emir_date_availabilities"`);
  }
}
