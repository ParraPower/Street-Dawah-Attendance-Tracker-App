import { BaseRepository } from "app-framework";
import { Repository } from "typeorm";
import { IClientRepository } from "../../../domains/repositories/iclient-repo";
import { ClientEntity } from "../../../domains/entities/client-entity";

export class ClientRepository extends BaseRepository<ClientEntity> implements IClientRepository {
  constructor(repo: Repository<ClientEntity>) {
    super(repo);
  }

  async findById(id: number): Promise<ClientEntity | null> {
    return this.findOneBy({ id } as never);
  }

  async findByName(name: string): Promise<ClientEntity | null> {
    return this.findOneBy({ name } as never);
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
    return this.find({
      where: { isDeleted: false } as never,
    });
  }
}
