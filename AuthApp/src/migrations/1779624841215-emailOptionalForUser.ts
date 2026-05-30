import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailOptionalForUser1779624841215 implements MigrationInterface {
    name = 'EmailOptionalForUser1779624841215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    }

}
