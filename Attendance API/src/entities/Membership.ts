import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { UserMembership } from "./UserMembership.js";
import { MembershipTypeEnum } from "./MembershipTypeEnum.js";

@Entity({ name: "memberships" })
@Index(["isActive"])
export class Membership {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  dateActivated?: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  dateTurnedOff?: Date | null;

  @Column({ type: "integer", name: "membership_types_flag", default: () => "0" })
  membershipTypesFlag!: number;

  @OneToMany(() => UserMembership, (um) => um.membership)
  userMemberships?: UserMembership[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
