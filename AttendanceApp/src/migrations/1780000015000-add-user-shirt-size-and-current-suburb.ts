import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserShirtSizeAndCurrentSuburb1780000015000 implements MigrationInterface {
    name = 'AddUserShirtSizeAndCurrentSuburb1780000015000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "shirtSize" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "currentSuburb" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "shirtSize"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currentSuburb"`);
    }
}
