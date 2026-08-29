import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { IMembershipEntity } from "./interfaces/membership-entity";

@Entity({ name: "memberships" })
@Index(["name", "isDeleted"])
export class MembershipEntity extends BaseEntity implements IMembershipEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 4 })
  code!: string;

  @Column({ type: "integer", name: "membership_types_flag", default: 0 })
  membershipTypesFlag!: number;
}
