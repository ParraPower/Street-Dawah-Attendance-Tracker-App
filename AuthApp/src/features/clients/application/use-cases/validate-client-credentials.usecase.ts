import { ClientEntity } from "../../domains/entities/client-entity";
import { IClientRepository } from "../../domains/repositories/iclient-repo";
import { ClientService } from "../../domains/services/client-service";

export class ValidateClientCredentialsUseCase {
  constructor(
    private readonly repo: IClientRepository,
    private readonly clientService: ClientService,
  ) { }

  async execute(clientName: string, clientSecret: string): Promise<ClientEntity | null> {
    const client = await this.repo.findByName(clientName);
    if (!client) return null;

    return await this.clientService.validateClientCredentials(client, clientSecret) ? client
      : null;
  }
}
