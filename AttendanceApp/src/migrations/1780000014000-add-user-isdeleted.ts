import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIsDeleted1780000014000 implements MigrationInterface {
    name = 'AddUserIsDeleted1780000014000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isDeleted" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isDeleted"`);
    }
}
