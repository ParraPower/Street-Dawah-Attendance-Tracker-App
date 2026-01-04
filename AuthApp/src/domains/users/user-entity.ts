import {
  Entity, Column,
} from 'typeorm';
import { IUserEntity } from './iuser-entity'
import { BaseEntity } from '@/core/abstracts/base-entity';

@Entity('users')
export class UserEntity extends BaseEntity implements IUserEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column('uuid', { unique: true, default: null })
  temporaryPaswordGuid?: string | null;

  @Column('simple-array', { default: '' })
  scopes!: string[]; // e.g. ['user-read', 'user-write']
}
