import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { IUserMembershipEntity } from "./interfaces/user-membership-entity";

@Entity({ name: "user_memberships" })
@Index("IDX_user_memberships_user", ["userId"])
@Index("IDX_user_memberships_membership", ["membershipId"])
@Index("IDX_user_memberships_user_membership", ["userId", "membershipId"], {
  unique: true,
  where: '"isDeleted" IS NOT TRUE',
})
export class UserMembershipEntity extends BaseEntity implements IUserMembershipEntity {
  @Column({ type: "integer" })
  userId!: number;

  @Column({ type: "integer" })
  membershipId!: number;

  @Column({ type: "boolean", default: true })
  active!: boolean;
}
