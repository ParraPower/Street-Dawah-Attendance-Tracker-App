// src/domain/keys/key.entity.ts
import { BaseEntity } from '@/shared/infrastructure/persistence/typeorm/abstracts/base-entity';
import { Entity, Column } from 'typeorm';

@Entity('jwt_keys')
export class JwtKey extends BaseEntity {

  @Column({ unique: true })
  kid!: string;

  @Column({ type: 'text' })
  publicKey!: string;

  @Column({ type: 'text', nullable: true })
  privateKey!: string | null;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ type: 'text' })
  algorithm!: string;
}
