import { ClientEntity } from "@/domains/clients/client-entity";

export interface IClientRepository {
  findById(id: number): Promise<ClientEntity | null>;
}
