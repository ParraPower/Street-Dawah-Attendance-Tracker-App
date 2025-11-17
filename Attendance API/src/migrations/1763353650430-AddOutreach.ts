import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOutreach1763353650430 implements MigrationInterface {
    name = 'AddOutreach1763353650430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "postcode" character varying(20) NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_outreach_activity_logs_directiontype_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "public"."user_outreach_activity_logs_activitytype_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "user_outreach_activity_logs" ("id" SERIAL NOT NULL, "volunteerUserId" integer NOT NULL, "managementOutreachUserId" integer NOT NULL, "activityDate" TIMESTAMP WITH TIME ZONE NOT NULL, "directionType" "public"."user_outreach_activity_logs_directiontype_enum" NOT NULL DEFAULT '0', "text" character varying(500) NOT NULL, "activityType" "public"."user_outreach_activity_logs_activitytype_enum" NOT NULL DEFAULT '0', "threadId" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_749c05dbb8b38a73768cc95bb53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9d9b57ca058b74b5143aa4cb41" ON "user_outreach_activity_logs" ("threadId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4178932c785db7809db00a2d92" ON "user_outreach_activity_logs" ("managementOutreachUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3e82894d6d4af844d0be4e78e5" ON "user_outreach_activity_logs" ("volunteerUserId") `);
        await queryRunner.query(`ALTER TABLE "user_outreach_activity_logs" ADD CONSTRAINT "FK_3e82894d6d4af844d0be4e78e50" FOREIGN KEY ("volunteerUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_outreach_activity_logs" ADD CONSTRAINT "FK_4178932c785db7809db00a2d923" FOREIGN KEY ("managementOutreachUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_outreach_activity_logs" ADD CONSTRAINT "FK_9d9b57ca058b74b5143aa4cb41d" FOREIGN KEY ("threadId") REFERENCES "user_outreach_activity_logs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_outreach_activity_logs" DROP CONSTRAINT "FK_9d9b57ca058b74b5143aa4cb41d"`);
        await queryRunner.query(`ALTER TABLE "user_outreach_activity_logs" DROP CONSTRAINT "FK_4178932c785db7809db00a2d923"`);
        await queryRunner.query(`ALTER TABLE "user_outreach_activity_logs" DROP CONSTRAINT "FK_3e82894d6d4af844d0be4e78e50"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e82894d6d4af844d0be4e78e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4178932c785db7809db00a2d92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d9b57ca058b74b5143aa4cb41"`);
        await queryRunner.query(`DROP TABLE "user_outreach_activity_logs"`);
        await queryRunner.query(`DROP TYPE "public"."user_outreach_activity_logs_activitytype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_outreach_activity_logs_directiontype_enum"`);
        await queryRunner.query(`DROP TABLE "locations"`);
    }

}
