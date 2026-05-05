import { Entity, Column, /*OneToMany,*/ } from 'typeorm';
// import { Attendance } from "../../attendance/Attendance.module.js";
// import { Session } from "../../session//Session.module.js";
//import { UserMembership } from "../../membership/Membership.module.js";
//import type { UserOutreachActivityLog } from "../../outreach/entities/UserOutreachActivityLog.js";
//import { IUserOutreachActivityLog } from '../../outreach/interfaces/iuser-outreach-activity-log.js';
import { IUserEntity } from './interfaces/IUser';
import { BaseEntity } from 'app-framework';


@Entity()
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

  // @OneToMany(() => Attendance, (a) => a.user)
  // attendances?: Attendance[];

  // @OneToMany(() => Session, (s) => s.emirUser)
  // sessions?: Session[];

  // @OneToMany(() => UserMembership, (um) => um.user)
  // userMemberships?: UserMembership[];

  // @OneToMany("UserOutreachActivityLog", "volunteerUser")
  // volunteerOutreachLogs?: IUserOutreachActivityLog[];

  // @OneToMany("UserOutreachActivityLog", "managementOutreachUser")
  // managementOutreachLogs?: IUserOutreachActivityLog[];
}
