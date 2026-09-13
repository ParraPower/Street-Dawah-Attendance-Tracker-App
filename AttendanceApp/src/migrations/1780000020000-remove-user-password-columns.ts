import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserPasswordColumns1780000020000 implements MigrationInterface {
    name = 'RemoveUserPasswordColumns1780000020000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordHash"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordSalt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordSalt" character varying(150) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordHash" character varying(250) NOT NULL DEFAULT ''`);
    }
}
