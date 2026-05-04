import { Repository } from "typeorm";
import { BaseRepository } from "@auth/shared/infrastructure/persistence/typeorm/abstracts/base-repository";
import { JwtKey } from "../../../domain/entities/key-entity";
import { IJwtKeyRepository } from "../../../domain/repositories/ijwtkey-repository";

export class JwtKeyRepository
  extends BaseRepository<JwtKey>
  implements IJwtKeyRepository
{
  constructor(repo: Repository<JwtKey>) {
    super(repo);
  }
  async findActiveKey(): Promise<JwtKey | null> {
    return await this.repo.findOne({
      where: { isActive: true },
      order: { createdAt: "DESC" }
    });
  
  }

  async findByKeyId(kid: string): Promise<JwtKey | null> {
    return await this.findOne({
      where: { kid: kid }
    });
  }

  async findById(id: number): Promise<JwtKey | null> {
    return await this.findOne({
      where: { id }
    });
  }

  async create(key: Partial<JwtKey>): Promise<JwtKey> {
    const entity = this.repo.create(key);
    return await this.repo.save(entity);
  }

  async update(id: number, key: Partial<JwtKey>): Promise<JwtKey | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    Object.assign(existing, key);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    // Use soft delete from BaseRepository
    await this.softDelete(id);
    return true;
  }

  async findAll(): Promise<JwtKey[]> {
    return this.find();
  }
}