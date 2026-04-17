import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseToJwtKey1776391103817 implements MigrationInterface {
    name = 'AddBaseToJwtKey1776391103817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jwt_keys" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" ADD "createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" ADD "updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" ADD "isDeleted" boolean`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jwt_keys" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "jwt_keys" DROP COLUMN "updatedAt"`);
    }

}
