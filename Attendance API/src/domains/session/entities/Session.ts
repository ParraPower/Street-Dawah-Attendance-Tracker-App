// src/entities/Session.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  Index,
} from "typeorm";
//import { User } from "../../user/entities/User.js";
//import { Location } from "../../location/entities/location.js";
import { Attendance } from "../../attendance/entities/attendance.js";

@Entity({ name: "sessions" })
@Index(["emirUserId"])
@Index(["locationId"])
export class Session {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  // // EmirUserID -> reference to User
  // @ManyToOne(() => User, (user) => user.sessions, { nullable: false, onDelete: "CASCADE" })
  // @JoinColumn({ name: "emirUserId" })
  // emirUser!: User;

  @Column()
  emirUserId!: number;

  // // Location reference for the session
  // @ManyToOne(() => Location, (location) => location.sessions, { nullable: false, onDelete: "CASCADE" })
  // @JoinColumn({ name: "locationId" })
  // location!: Location;

  @Column()
  locationId!: number;

  // Date only
  @Column({ type: "date" })
  date!: string;

  // Start time only
  @Column({ type: "time" })
  startTime!: string;

  @OneToMany(() => Attendance, (a) => a.session)
  attendances?: Attendance[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
