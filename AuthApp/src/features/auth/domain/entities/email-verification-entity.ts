import { BaseEntity } from "app-framework";
import { Column, Entity } from "typeorm";

@Entity('email_verifications')
export class EmailVerificationEntity extends BaseEntity {
    @Column('number')
    userId!: number;

    @Column()
    codeHash!: string;

    @Column('timestamp')
    expiresAt!: Date;

    @Column('timestamp', { nullable: true })
    consumedAt?: Date | null;

    @Column('timestamp', { nullable: true })
    invalidatedAt?: Date | null;
}