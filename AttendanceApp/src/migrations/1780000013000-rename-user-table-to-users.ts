import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserTableToUsers1780000013000 implements MigrationInterface {
    name = 'RenameUserTableToUsers1780000013000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "user"`);
    }
}
