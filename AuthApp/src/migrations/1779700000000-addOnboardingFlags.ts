import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnboardingFlags1779700000000 implements MigrationInterface {
    name = 'AddOnboardingFlags1779700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "onboardingFlags" bigint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "onboardingFlags"`);
    }

}
