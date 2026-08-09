import { MembershipEntity } from "../entities/membership-entity";

export interface IMembershipRepository {
  findById(id: number): Promise<MembershipEntity | null>;
  findByName(name: string): Promise<MembershipEntity | null>;
  findAll(): Promise<MembershipEntity[]>;
  create(membership: Partial<MembershipEntity>): Promise<MembershipEntity>;
  update(id: number, membership: Partial<MembershipEntity>): Promise<MembershipEntity | null>;
  delete(id: number): Promise<boolean>;
  createBulk(memberships: MembershipEntity[]): Promise<MembershipEntity[]>;
}
