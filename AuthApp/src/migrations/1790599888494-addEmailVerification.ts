import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerification1790599888494 implements MigrationInterface {
    name = 'AddEmailVerification1790599888494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verifications" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "createdBy" integer, "updatedBy" integer, "id" SERIAL NOT NULL, "isDeleted" boolean, "userId" integer NOT NULL, "codeHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "consumedAt" TIMESTAMP, "invalidatedAt" TIMESTAMP, CONSTRAINT "PK_c1ea2921e767f83cd44c0af203f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_email_verifications_user_id" ON "email_verifications" ("userId")`);
        await queryRunner.query(`CREATE INDEX "idx_email_verifications_user_id_created_at" ON "email_verifications" ("userId", "createdAt" DESC)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_email_verifications_user_id_created_at"`);
        await queryRunner.query(`DROP INDEX "idx_email_verifications_user_id"`);
        await queryRunner.query(`DROP TABLE "email_verifications"`);
    }

}
