import { Repository } from "typeorm";
import { IClientRepository } from "../../../domains/repositories/iclient-repo";
import { ClientEntity } from "../../../domains/entities/client-entity";

export class ClientRepository implements IClientRepository {
  constructor(private readonly repo: Repository<ClientEntity>) {}

  async findById(id: number): Promise<ClientEntity | null> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) return null;

    return record
  }

  async findByName(name: string): Promise<ClientEntity | null> {
    const record = await this.repo.findOne({ where: { name } });
    if (!record) return null;

    return record
  }

  async create(client: Partial<ClientEntity>): Promise<ClientEntity> {
    const entity = this.repo.create(client);
    return await this.repo.save(entity);
  }

  async update(id: number, client: Partial<ClientEntity>): Promise<ClientEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    Object.assign(existing, client);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findAll(): Promise<ClientEntity[]> {
    return await this.repo.find({
      where: { isDeleted: false },
    });
  }
}
