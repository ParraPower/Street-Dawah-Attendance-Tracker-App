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
import { MembershipTypeEnum } from "../enums/membership-type-enum.js";

@Entity({ name: "memberships" })
@Index(["isDeleted"])
export class Membership implements IMembership, IAudit, IBaseEntity {

  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ type: "integer", name: "membership_types_flag", default: () => MembershipTypeEnum.NONE.valueOf() })
  membershipTypesFlag!: number;

  @OneToMany("UserMembership", "membership")
  userMemberships?: IUserMembership[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updatedAt?: Date;

  @Column()
  createdBy!: number;
  
  @Column({ nullable: true })
  updatedBy?: number;
}
