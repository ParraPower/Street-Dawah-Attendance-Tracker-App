import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionOccurrenceCounts1780000003000 implements MigrationInterface {
  name = "AddSessionOccurrenceCounts1780000003000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session_occurrences" ADD "NoOfShahadahs" integer`);
    await queryRunner.query(`ALTER TABLE "session_occurrences" ADD "NoOfQuransDistributed" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session_occurrences" DROP COLUMN "NoOfQuransDistributed"`);
    await queryRunner.query(`ALTER TABLE "session_occurrences" DROP COLUMN "NoOfShahadahs"`);
  }
}