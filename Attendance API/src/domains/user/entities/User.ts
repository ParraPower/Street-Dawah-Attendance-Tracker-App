import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn } from 'typeorm';
// import { Attendance } from "../../attendance/Attendance.module.js";
// import { Session } from "../../session//Session.module.js";
//import { UserMembership } from "../../membership/Membership.module.js";
//import type { UserOutreachActivityLog } from "../../outreach/entities/UserOutreachActivityLog.js";
import { IUserOutreachActivityLog } from '../../outreach/interfaces/iuser-outreach-activity-log.js';
import { IUser } from '../interfaces/iuser.js';
import { IBaseEntity } from '../../../core/interfaces/ibase-entity.js';
import { IAudit } from '../../../core/interfaces/iaudit.js';

@Entity()
export class User implements IUser, IBaseEntity, IAudit {  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  mobile!: string;

  @Column({ select: false })
  passwordHash!: string;

  // @OneToMany(() => Attendance, (a) => a.user)
  // attendances?: Attendance[];

  // @OneToMany(() => Session, (s) => s.emirUser)
  // sessions?: Session[];

  // @OneToMany(() => UserMembership, (um) => um.user)
  // userMemberships?: UserMembership[];

  @OneToMany("UserOutreachActivityLog", "volunteerUser")
  volunteerOutreachLogs?: IUserOutreachActivityLog[];

  @OneToMany("UserOutreachActivityLog", "managementOutreachUser")
  managementOutreachLogs?: IUserOutreachActivityLog[];

  isActive!: boolean;

  @UpdateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
  
  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt?: Date;
}
