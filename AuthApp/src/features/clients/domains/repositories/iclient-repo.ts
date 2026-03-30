import { ClientEntity } from "../entities/client-entity";

export interface IClientRepository {
  findById(id: number): Promise<ClientEntity | null>;
  findByName(name: string): Promise<ClientEntity | null>;
  create(client: Partial<ClientEntity>): Promise<ClientEntity>;
  update(id: number, client: Partial<ClientEntity>): Promise<ClientEntity | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<ClientEntity[]>;
}
