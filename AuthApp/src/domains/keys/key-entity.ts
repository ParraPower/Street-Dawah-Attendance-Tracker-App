// src/domain/keys/key.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('jwt_keys')
export class JwtKey {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @CreateDateColumn()
  createdAt!: Date;
}
