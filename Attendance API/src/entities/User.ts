import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from "./Attendance.js";
import { Session } from "./Session.js";
import { UserMembership } from "./UserMembership.js";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  mobile!: string;

  @OneToMany(() => Attendance, (a) => a.user)
  attendances?: Attendance[];

  @OneToMany(() => Session, (s) => s.emirUser)
  sessions?: Session[];

  @OneToMany(() => UserMembership, (um) => um.user)
  userMemberships?: UserMembership[];
}
