import { UserMembershipEntity } from "../entities/user-membership-entity";

export interface IUserMembershipRepository {
  findById(id: number): Promise<UserMembershipEntity | null>;
  findAll(): Promise<UserMembershipEntity[]>;
  findByUserId(userId: number): Promise<UserMembershipEntity[]>;
  findByMembershipId(membershipId: number): Promise<UserMembershipEntity[]>;
  findByUserAndMembership(userId: number, membershipId: number, excludeId?: number): Promise<UserMembershipEntity | null>;
  create(userMembership: Partial<UserMembershipEntity>): Promise<UserMembershipEntity>;
  update(id: number, userMembership: Partial<UserMembershipEntity>): Promise<UserMembershipEntity | null>;
  delete(id: number): Promise<boolean>;
  createBulk(userMemberships: Partial<UserMembershipEntity>[]): Promise<UserMembershipEntity[]>;
}
