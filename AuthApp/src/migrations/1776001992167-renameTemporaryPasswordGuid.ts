import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTemporaryPasswordGuid1776001992167 implements MigrationInterface {
    name = 'RenameTemporaryPasswordGuid1776001992167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "temporaryPaswordGuid" TO "temporaryPasswordGuid"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_d0de5a4c6132241d7364a413183" TO "UQ_21534174364bde297f663616ed2"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_21534174364bde297f663616ed2" TO "UQ_d0de5a4c6132241d7364a413183"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "temporaryPasswordGuid" TO "temporaryPaswordGuid"`);
    }

}
