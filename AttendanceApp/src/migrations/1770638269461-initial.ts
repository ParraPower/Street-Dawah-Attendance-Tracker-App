import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1770638269461 implements MigrationInterface {
    name = 'Initial1770638269461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying, "mobile" character varying NOT NULL, "authUserId" integer, "passwordHash" character varying(250) NOT NULL, "passwordSalt" character varying(150) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "memberships" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "membership_types_flag" integer NOT NULL DEFAULT 0, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer, CONSTRAINT "PK_25d28bd932097a9e90495ede7b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_82854e568902e7222dd8d13b5b" ON "memberships" ("isDeleted") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_82854e568902e7222dd8d13b5b"`);
        await queryRunner.query(`DROP TABLE "memberships"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
