import { LoginUserUseCase } from "./login-user.usecase";
  import { IssueClientCredentialsTokenUseCase } from "./issue-client-credentials-token.usecase";

export class GenerateTokenUseCase {
  constructor(
    private readonly issueClientCredentialsToken: IssueClientCredentialsTokenUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  async execute(dto: any) {
    switch (dto.grant_type) {
      case 'client_credentials':
        return this.issueClientCredentialsToken.execute(dto.client_id, dto.client_secret);

      case 'password':
        return this.loginUserUseCase.execute(dto.email, dto.password);

      default:
        throw new Error('Unsupported grant_type'); // #TODO: custom error for this case
    }
  }
}