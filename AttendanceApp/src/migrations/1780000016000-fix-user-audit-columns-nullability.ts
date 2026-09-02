import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserAuditColumnsNullability1780000016000 implements MigrationInterface {
    name = 'FixUserAuditColumnsNullability1780000016000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdBy" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedBy" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "users" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL`);
        await queryRunner.query(`UPDATE "users" SET "createdBy" = 0 WHERE "createdBy" IS NULL`);
        await queryRunner.query(`UPDATE "users" SET "updatedBy" = 0 WHERE "updatedBy" IS NULL`);

        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdBy" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedBy" SET NOT NULL`);
    }
}
