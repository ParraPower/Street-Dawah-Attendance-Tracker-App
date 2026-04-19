import { Entity, PrimaryGeneratedColumn, Column, /*OneToMany,*/ UpdateDateColumn } from 'typeorm';
// import { Attendance } from "../../attendance/Attendance.module.js";
// import { Session } from "../../session//Session.module.js";
//import { UserMembership } from "../../membership/Membership.module.js";
//import type { UserOutreachActivityLog } from "../../outreach/entities/UserOutreachActivityLog.js";
//import { IUserOutreachActivityLog } from '../../outreach/interfaces/iuser-outreach-activity-log.js';
import { IUser } from '../interfaces/IUser';

@Entity()
export class User implements IUser {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  mobile!: string;

  @Column({ nullable: true })
  authUserId?: number;

  @Column({ select: false, length: 250 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 150 })
  passwordSalt!: string;

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

  isDeleted?: boolean;

  @UpdateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
  
  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt?: Date;

  @Column()
  createdBy!: number;

  @Column({ nullable: true })
  updatedBy?: number;  
}
