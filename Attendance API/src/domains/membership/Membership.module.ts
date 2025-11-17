// src/domains/user/user.module.ts
import { Membership } from "./entities/Membership.js";
import { UserMembership } from "./entities/UserMembership.js";
import { MembershipTypeEnum } from "./enums/MembershipTypeEnum.js";

export const MembershipEntities = [
  Membership,
  UserMembership
];

export { UserMembership }

export const MembershipEnums = [
  MembershipTypeEnum,
];

export { MembershipTypeEnum }
