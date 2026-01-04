import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1767526017512 implements MigrationInterface {
    name = 'InitialMigration1767526017512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "createdBy" integer, "updatedBy" integer, "id" SERIAL NOT NULL, "isDeleted" boolean NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "temporaryPaswordGuid" uuid, "scopes" text NOT NULL DEFAULT '', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_d0de5a4c6132241d7364a413183" UNIQUE ("temporaryPaswordGuid"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jwt_keys" ("id" SERIAL NOT NULL, "kid" character varying NOT NULL, "publicKey" text NOT NULL, "privateKey" text, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_61d11f90b86f688367a911d5eb8" UNIQUE ("kid"), CONSTRAINT "PK_5b1f7509e0d3865a4f252e0d992" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "jwt_keys"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
