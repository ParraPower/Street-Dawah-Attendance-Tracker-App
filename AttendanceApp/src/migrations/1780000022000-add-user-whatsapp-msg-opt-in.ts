import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserWhatsAppMsgOptIn1780000022000 implements MigrationInterface {
    name = 'AddUserWhatsAppMsgOptIn1780000022000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "whatsAppMsgOptIn" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "whatsAppMsgOptIn"`);
    }
}
