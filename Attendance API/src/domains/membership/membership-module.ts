// src/domains/user/user.module.ts
import { Membership } from "./entities/membership.js";
import { UserMembership } from "./entities/user-membership.js";
import { MembershipTypeEnum } from "./enums/membership-type-enum.js";

export const MembershipEntities = [
  Membership,
  UserMembership
];

export { UserMembership }

export const MembershipEnums = [
  MembershipTypeEnum,
];

export { MembershipTypeEnum }
