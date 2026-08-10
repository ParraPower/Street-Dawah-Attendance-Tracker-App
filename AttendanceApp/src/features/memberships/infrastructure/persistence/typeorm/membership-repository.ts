import { Raw, Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { MembershipEntity } from "../../../domain/entities/membership-entity";
import { IMembershipRepository } from "../../../domain/repositories/imembership-repository";

export class MembershipRepository extends BaseRepository<MembershipEntity> implements IMembershipRepository {
  constructor(repo: Repository<MembershipEntity>) { super(repo); }
  findById(id: number): Promise<MembershipEntity | null> { return this.findOne({ where: { id, isDeleted: false } }); }
  findByName(name: string): Promise<MembershipEntity | null> {
    return this.findOne({ where: { name: Raw((alias) => `LOWER(${alias}) = LOWER(:name)`, { name }), isDeleted: false } });
  }
  findAll(): Promise<MembershipEntity[]> { return this.find(); }
  async create(membership: Partial<MembershipEntity>): Promise<MembershipEntity> { return this.repo.save(this.repo.create(membership)); }
  async update(id: number, membership: Partial<MembershipEntity>): Promise<MembershipEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, membership);
    return this.repo.save(existing);
  }
  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
  async createBulk(memberships: MembershipEntity[]): Promise<MembershipEntity[]> {
    return this.repo.manager.transaction((trx) => trx.save(MembershipEntity, memberships));
  }
}
