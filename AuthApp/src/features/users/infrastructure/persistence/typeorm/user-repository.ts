import { Repository } from "typeorm";
import { IUserRepository } from "../../../domain/repositories/iuser-repository";
import { UserEntity } from "../../../domain/entities/user-entity";

export class UserRepository implements IUserRepository {
  constructor(private readonly repo: Repository<UserEntity>) {}
  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) return null;

    return record
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const record = await this.repo.findOne({ where: { username } });
    if (!record) return null;

    return record
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
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repo.find({
      where: { isDeleted: false },
    });
  }
}
