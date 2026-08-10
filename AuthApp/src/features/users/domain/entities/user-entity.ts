import {
  Entity, Column,
} from 'typeorm';
import { IUserEntity } from './iuser-entity'
import { BaseEntity } from 'app-framework';

@Entity('users')
export class UserEntity extends BaseEntity implements IUserEntity {
  @Column('varchar', { default: null })
  email?: string | null;

  @Column()
  username!: string;

  @Column('varchar', { default: null })
  passwordHash?: string | null;

  @Column('uuid', { unique: true, default: null })
  temporaryPasswordGuid?: string | null;

  @Column('simple-array', { default: '' })
  scopes!: string[]; // e.g. ['user-read', 'user-write']
}
