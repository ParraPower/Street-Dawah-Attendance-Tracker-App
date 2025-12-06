// src/entities/UserOutreachActivityLog.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from "typeorm";

import { OutreachDirectionTypeEnum } from "../enums/outreach-direction-type-enum.js";
import { OutreachActivityTypeEnum } from "../enums/outreach-activity-type-enum.js";
import { IUserOutreachActivityLog } from "../interfaces/iuser-outreach-activity-log.js";
import { IUser } from "../../user/interfaces/iuser.js";

@Entity({ name: "user_outreach_activity_logs" })
@Index(["volunteerUserId"])
@Index(["managementOutreachUserId"])
@Index(["threadId"])
export class UserOutreachActivityLog implements IUserOutreachActivityLog {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @ManyToOne("User", { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "volunteerUserId" })
  volunteerUser!: IUser;

  @Column()
  volunteerUserId!: number;

  @ManyToOne("User", { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "managementOutreachUserId" })
  managementOutreachUser!: IUser;

  @Column()
  managementOutreachUserId!: number;

  @Column({ type: "timestamptz" })
  activityDate!: Date;

  @Column({ type: "enum", enum: OutreachDirectionTypeEnum, default: OutreachDirectionTypeEnum.NONE })
  directionType!: OutreachDirectionTypeEnum;

  @Column({ type: "varchar", length: 500 })
  text!: string;

  @Column({ type: "enum", enum: OutreachActivityTypeEnum, default: OutreachActivityTypeEnum.NONE })
  activityType!: OutreachActivityTypeEnum;

  @ManyToOne(() => UserOutreachActivityLog, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "threadId" })
  thread?: UserOutreachActivityLog;

  @Column({ nullable: true })
  threadId?: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
