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
import { User } from "./User.js";
import { Membership } from "./Membership.js";

@Entity({ name: "user_memberships" })
@Index(["userId"])
@Index(["membershipId"])
export class UserMembership {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @ManyToOne(() => User, (u) => u.userMemberships, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Membership, (m) => m.userMemberships, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "membershipId" })
  membership!: Membership;

  @Column()
  membershipId!: number;

  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  dateActivated?: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  dateTurnedOff?: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
