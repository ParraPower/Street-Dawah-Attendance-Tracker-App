import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClients1772341101336 implements MigrationInterface {
    name = 'AddClients1772341101336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "createdBy" integer, "updatedBy" integer, "id" SERIAL NOT NULL, "isDeleted" boolean, "name" character varying NOT NULL, "secretHash" character varying NOT NULL, "scopes" text NOT NULL DEFAULT '', CONSTRAINT "UQ_99e921caf21faa2aab020476e44" UNIQUE ("name"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
