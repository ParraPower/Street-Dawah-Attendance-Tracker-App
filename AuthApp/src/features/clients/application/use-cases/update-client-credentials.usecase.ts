import { ClientEntity } from "../../domains/entities/client-entity";
import { IClientRepository } from "../../domains/repositories/iclient-repo";

export class UpdateClientCredentialsUseCase {
  constructor(
    private readonly repo: IClientRepository
  ) { }
  async execute(id: number,
    updates: Partial<{ name: string; scopes: string[] }>
  ): Promise<ClientEntity | null> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Client not found'); // #TODO: Custom error type
    }

    // Check if new name already exists (if name is being changed)
    if (updates.name && updates.name !== existing.name) { 
      const duplicate = await this.repo.findByName(updates.name);
      if (duplicate) {
        throw new Error('Client with this name already exists'); // #TODO: Custom error type
      }
    }

    return await this.repo.update(id, updates);
  }
}