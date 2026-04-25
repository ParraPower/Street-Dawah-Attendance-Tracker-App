import {
  Entity, Column,
} from 'typeorm';
import { IUserEntity } from './iuser-entity'
import { BaseEntity } from '@street-dawah/app-framework';

@Entity('users')
export class UserEntity extends BaseEntity implements IUserEntity {
  @Column()
  email!: string;

  @Column()
  username!: string;

  @Column('varchar', { default: null })
  passwordHash?: string | null;

  @Column('uuid', { unique: true, default: null })
  temporaryPasswordGuid?: string | null;

  @Column('simple-array', { default: '' })
  scopes!: string[]; // e.g. ['user-read', 'user-write']
}
