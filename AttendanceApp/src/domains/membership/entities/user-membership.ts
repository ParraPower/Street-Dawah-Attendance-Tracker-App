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
import { IMembership } from "../interfaces/imembership.js";
import { IUserMembership } from "../interfaces/iuser-membership.js";
import { IBaseEntityStub } from "../../../core/interfaces/ibase-entity-stub.js";
import { IBaseAudit } from "../../../core/interfaces/ibase-audit.js";

@Entity({ name: "user_memberships" })
@Index(["userId"])
@Index(["membershipId"])
export class UserMembership implements IUserMembership, IBaseEntityStub, IBaseAudit {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  // @ManyToOne(() => User, (u) => u.userMemberships, { nullable: false, onDelete: "CASCADE" })
  // @JoinColumn({ name: "userId" })
  // user!: User;

  @Column()
  userId!: number;

  @ManyToOne("Membership", "userMemberships", { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "membershipId" })
  membership!: IMembership;

  @Column()
  membershipId!: number;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  dateActivated?: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  dateTurnedOff?: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updatedAt?: Date;

  @Column()
  createdBy!: number;
  
  @Column({ nullable: true })
  updatedBy?: number;
}
