import { ClientEntity } from "../../domains/entities/client-entity";
import { IClientRepository } from "../../domains/repositories/iclient-repo";
import { ClientService } from "../../domains/services/client-service";

export class CreateClientCredentialsUseCase {
  constructor(
    private readonly repo: IClientRepository,
    private readonly clientService: ClientService,
  ) { }
  async execute(name: string,
    scopes: string[]
  ): Promise<{ client: ClientEntity; secret: string }> {
    // Check if client already exists
    const existing = await this.repo.findByName(name);
    if (existing) {
      throw new Error('Client with this name already exists'); // #TODO: Custom error type
    }

    // Generate a secure random secret
    const secret = await this.clientService.generateClientSecret();
    const secretHash = await this.clientService.generateClientSecretHash(secret);

    const client = await this.repo.create({
      name,
      secretHash,
      scopes,
    });

    return { client, secret };
  }
}