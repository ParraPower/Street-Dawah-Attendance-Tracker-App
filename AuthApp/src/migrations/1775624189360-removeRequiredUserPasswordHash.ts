import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRequiredUserPasswordHash1775624189360 implements MigrationInterface {
    name = 'RemoveRequiredUserPasswordHash1775624189360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL`);
    }

}
