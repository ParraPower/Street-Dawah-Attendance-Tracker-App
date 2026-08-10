import { LoginUserUseCase } from "./login-user.usecase";
  import { IssueClientCredentialsTokenUseCase } from "./issue-client-credentials-token.usecase";
import { UnsupportedGrantTypeError } from "@auth/shared/infrastructure/errors/auth-errors";

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
        return this.loginUserUseCase.execute(dto.username, dto.password);

      default:
        throw new UnsupportedGrantTypeError(dto.grant_type);
    }
  }
}