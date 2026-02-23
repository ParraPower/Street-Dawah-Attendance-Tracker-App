import { ClientRepository } from "@/data/clients/client-repo";
import { PasswordService } from "../password/password-service";

export class ClientService {
  constructor(
    private readonly repo: ClientRepository,
    private readonly passwordService: PasswordService
  ) {}

  async validateClientCredentials(clientName: string, clientSecret: string) {
    const client = await this.repo.findByName(clientName);
    if (!client || client.isDeleted) return null;

    const valid = await this.passwordService.compareSecret(clientSecret, client.secretHash);
    return valid ? client : null;
  }
}

