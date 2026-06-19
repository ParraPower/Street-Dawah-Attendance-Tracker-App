import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { UserEntity } from "../../../domain/entities/user-entity";
import { IUserRepository } from "../../../domain/repositories/iuser-repository";

export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(repo: Repository<UserEntity>) {
    super(repo);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.findOne({
      where: { id }
    });
  }

  async findByAuthUserId(authUserId: number): Promise<UserEntity | null> {
    return this.findOne({
      where: { authUserId }
    });
  }

  async findByMobile(mobile: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { mobile }
    });
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.repo.create(user);
    return await this.repo.save(entity);
  }

  async update(id: number, user: Partial<UserEntity>): Promise<UserEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    Object.assign(existing, user);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    // Use soft delete from BaseRepository
    await this.softDelete(id);
    return true;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.find();
  }

  async createBulk(entities: UserEntity[]): Promise<UserEntity[]> {
    return await this.repo.manager.transaction(async (trx) => {
      return await trx.save(UserEntity, entities);
    });
  }
}
