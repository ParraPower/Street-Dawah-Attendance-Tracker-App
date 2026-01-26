import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAlgorithmColumn1768860826793 implements MigrationInterface {
    name = 'AddAlgorithmColumn1768860826793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jwt_keys" ADD "algorithm" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jwt_keys" DROP COLUMN "algorithm"`);
    }

}
