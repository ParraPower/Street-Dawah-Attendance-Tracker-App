import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveForcedIsDeletedFlag1768939406402 implements MigrationInterface {
    name = 'RemoveForcedIsDeletedFlag1768939406402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isDeleted" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isDeleted" SET NOT NULL`);
    }

}
