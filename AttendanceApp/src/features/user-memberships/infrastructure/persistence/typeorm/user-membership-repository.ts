import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { UserMembershipEntity } from "../../../domain/entities/user-membership-entity";
import { IUserMembershipRepository } from "../../../domain/repositories/iuser-membership-repository";

export class UserMembershipRepository extends BaseRepository<UserMembershipEntity> implements IUserMembershipRepository {
  constructor(repo: Repository<UserMembershipEntity>) { super(repo); }

  findById(id: number): Promise<UserMembershipEntity | null> { return this.findOne({ where: { id } }); }
  findAll(): Promise<UserMembershipEntity[]> { return this.find(); }

  findByUserId(userId: number): Promise<UserMembershipEntity[]> {
    return this.repo.createQueryBuilder("userMembership")
      .where("userMembership.userId = :userId", { userId })
      .andWhere("userMembership.isDeleted IS NOT TRUE")
      .getMany();
  }

  findByMembershipId(membershipId: number): Promise<UserMembershipEntity[]> {
    return this.repo.createQueryBuilder("userMembership")
      .where("userMembership.membershipId = :membershipId", { membershipId })
      .andWhere("userMembership.isDeleted IS NOT TRUE")
      .getMany();
  }

  findByUserAndMembership(userId: number, membershipId: number, excludeId?: number): Promise<UserMembershipEntity | null> {
    const query = this.repo.createQueryBuilder("userMembership")
      .where("userMembership.userId = :userId", { userId })
      .andWhere("userMembership.membershipId = :membershipId", { membershipId })
      .andWhere("userMembership.isDeleted IS NOT TRUE");
    if (excludeId !== undefined) query.andWhere("userMembership.id != :excludeId", { excludeId });
    return query.getOne();
  }

  async create(userMembership: Partial<UserMembershipEntity>): Promise<UserMembershipEntity> {
    return this.repo.save(this.repo.create(userMembership));
  }

  async update(id: number, userMembership: Partial<UserMembershipEntity>): Promise<UserMembershipEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, userMembership);
    return this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }

  async createBulk(userMemberships: Partial<UserMembershipEntity>[]): Promise<UserMembershipEntity[]> {
    return this.repo.manager.transaction(async (manager) =>
      manager.save(UserMembershipEntity, userMemberships.map((userMembership) => manager.create(UserMembershipEntity, userMembership))),
    );
  }
}
