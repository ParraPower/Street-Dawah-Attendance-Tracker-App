import { Repository } from "typeorm";
import { IClientRepository } from "@/domains/clients/iclient-repo";
import { ClientEntity } from "@/domains/clients/client-entity";

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
}
