import { MembershipTypeEnum } from "../enums/membership-type-enum";
import { MembershipEntity } from "../entities/membership-entity";

export class MembershipService {
  normalizeName(value: string): string { return value.trim().replace(/\s+/g, " "); }
  isActive(membership: MembershipEntity): boolean { return !membership.isDeleted; }
  normalizeCode(value?: string): string | undefined { return value ? value.trim().toUpperCase() : undefined; }
  validateCode(value?: string): string | undefined {
    if (value === undefined || value === null) return undefined;
    const normalized = this.normalizeCode(value);
    if (!/^[A-Z]{4}$/.test(normalized!)) throw new Error("Invalid membership code; must be 4 uppercase letters");
    return normalized;
  }
  validateTypesFlag(value: number): number {
    const allowed = MembershipTypeEnum.NEW_VOLUNTEERS | MembershipTypeEnum.REGULAR_MEMBERS |
      MembershipTypeEnum.MANAGEMENT | MembershipTypeEnum.EMIR | MembershipTypeEnum.SHURAH;
    if (!Number.isInteger(value) || value < 0 || (value & ~allowed) !== 0) {
      throw new Error("Invalid membership types flag");
    }
    return value;
  }
}
