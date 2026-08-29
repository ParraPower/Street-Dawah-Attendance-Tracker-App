import { Entity, Column, /*OneToMany,*/ } from 'typeorm';
//import type { UserOutreachActivityLog } from "../../outreach/entities/UserOutreachActivityLog.js";
//import { IUserOutreachActivityLog } from '../../outreach/interfaces/iuser-outreach-activity-log.js';
import { IUserEntity } from './interfaces/user-entity';
import { BaseEntity } from 'app-framework';


@Entity("users")
export class UserEntity extends BaseEntity implements IUserEntity {
  @Column({ nullable: true, type: 'varchar' })
  shirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL' | undefined;
  
  @Column({ nullable: true })
  currentSuburb?: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  mobile!: string;

  @Column({ nullable: true })
  authUserId?: number;

  // @OneToMany("UserOutreachActivityLog", "volunteerUser")
  // volunteerOutreachLogs?: IUserOutreachActivityLog[];

  // @OneToMany("UserOutreachActivityLog", "managementOutreachUser")
  // managementOutreachLogs?: IUserOutreachActivityLog[];
}
