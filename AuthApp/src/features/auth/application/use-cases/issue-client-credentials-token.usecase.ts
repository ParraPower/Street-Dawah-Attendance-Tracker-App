import { IClientRepository } from "../../../clients/domains/repositories/iclient-repo";
import { ClientService } from "../../../clients/domains/services/client-service";
import { IJwtService } from "../../domain/services/jwt-service";
import { TokenResponseDto } from "../dtos/token-response.dto";


export class IssueClientCredentialsTokenUseCase {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly repo: IClientRepository,
    private readonly clientService: ClientService,
  ) { }

  async execute(clientName: string, clientSecret: string): Promise<TokenResponseDto | null> {
    const client = await this.repo.findByName(clientName);
    if (!client) return null; // #TODO: custom error for this case

    const isValid = await this.clientService.validateClientCredentials(client, clientSecret);
    if (!isValid) return null; // #TODO: custom error for this case

    const token = this.jwtService.signToken(client.name, client.scopes, 'access');
    const response: TokenResponseDto = {
      accessToken: token.token,
      accessTokenExpiresIn: token.expiresIn.toString(),
    }

    return response;
  }
}
