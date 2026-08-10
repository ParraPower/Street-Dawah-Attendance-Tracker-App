import { MembershipTypeEnum } from "../../../../domains/membership/enums/membership-type-enum";
import { MembershipEntity } from "../entities/membership-entity";

export class MembershipService {
  normalizeName(value: string): string { return value.trim().replace(/\s+/g, " "); }
  isActive(membership: MembershipEntity): boolean { return !membership.isDeleted; }
  validateTypesFlag(value: number): number {
    const allowed = MembershipTypeEnum.NEW_VOLUNTEERS | MembershipTypeEnum.REGULAR_MEMBERS |
      MembershipTypeEnum.MANAGEMENT | MembershipTypeEnum.EMIR | MembershipTypeEnum.ADMIN;
    if (!Number.isInteger(value) || value < 0 || (value & ~allowed) !== 0) {
      throw new Error("Invalid membership types flag");
    }
    return value;
  }
}
