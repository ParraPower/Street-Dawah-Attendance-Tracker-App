import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { IMembership } from './../interfaces/imembership.js';
import { IUserMembership } from './../interfaces/iuser-membership.js';
import { IAudit } from "../../../core/interfaces/iaudit.js";
import { IBaseEntity } from "../../../core/interfaces/ibase-entity.js";

@Entity({ name: "memberships" })
@Index(["isActive"])
export class Membership implements IMembership, IAudit, IBaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  mobile!: string;

  @Column({ type: "varchar", length: 150 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 150 })
  passwordSalt!: string;

  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  dateActivated?: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  dateTurnedOff?: Date | null;

  @Column({ type: "integer", name: "membership_types_flag", default: () => "0" })
  membershipTypesFlag!: number;

  @OneToMany("UserMembership", "membership")
  userMemberships?: IUserMembership[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
