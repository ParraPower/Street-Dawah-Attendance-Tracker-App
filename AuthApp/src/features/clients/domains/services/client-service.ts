import { IHasherService } from "@/features/auth/domains/services/hasher-service";
import { ClientEntity } from "../entities/client-entity";

export class ClientService {
  constructor(
    private readonly hasherService: IHasherService
  ) { }

  async generateClientSecretHash(secret: string): Promise<string> {
    return await this.hasherService.generateHash(secret);
  }

  async generateClientSecret(): Promise<string> {
    return await new Promise((resolve, reject) => {
      require('crypto').randomBytes(32, (err: any, buffer: any) => {
        if (err) reject(err);
        resolve(buffer.toString('base64'));
      });
    });
  }

  // async getClientCredentials(id: number): Promise<ClientEntity | null> {
  //   return await this.repo.findById(id);
  // }

  // async getAllClientCredentials(): Promise<ClientEntity[]> {
  //   return await this.repo.findAll();
  // }
  
  async validateClientCredentials(
    client: ClientEntity,
    providedSecret: string
  ): Promise<boolean> {
    if (client.isDeleted) return false;
    return this.hasherService.verify(providedSecret, client.secretHash);
  }

}