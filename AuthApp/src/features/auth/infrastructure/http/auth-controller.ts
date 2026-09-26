
import { Router } from 'express';
import { DawahRequestHandler } from '@auth/shared/infrastructure/http/dawah-request-handler';
import { RegisterUserDto, RegisterUserResponseDto } from '../../application/dtos/register-user.dto';
import { ClientCredentialsDto } from '../../application/dtos/client-credentials-token-request.dto';
import { GenerateTokenUseCase, RegisterUserUseCase } from '@auth/features/auth/application/use-cases/index';
import { LoginRequestDto } from '@auth/features/auth/application/dtos/login-request.dto';
import { UserDto } from '@auth/features/users/application/dtos/user.dto';
import { ResetUserPasswordUseCase } from '../../application/use-cases/reset-user-password.usecase';
import { ResetUserPasswordResponseDto } from '../../application/dtos/reset-user-password.dto';
import { BaseController } from '@auth/shared/infrastructure/http/base-controller';
import { ScopeService } from "app-framework";
import { IAuthAppJwtService } from '../../domain/services/jwt-service';
import { env } from '@auth/shared/infrastructure/config/env';
import { AccessTokenRequestDto } from '../../application/dtos/access-token-request.dto';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/refresh-access-token.usecase';
import { RetrieveImportedUseCase } from '@auth/features/users/application/use-cases/retrieve-imported.usecase';
import { RequestWithUser } from "app-framework"

export class AuthController extends BaseController {
  public readonly router = Router();

  constructor(
    protected readonly jwtService: IAuthAppJwtService,
    protected readonly scopeService: ScopeService,
    private readonly generateTokenUserCase: GenerateTokenUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly resetUserPasswordUseCase: ResetUserPasswordUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
      private readonly retrieveImportedUseCase?: RetrieveImportedUseCase) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.jwtDefaultAudience });

    this.registerRoute('post', '/register', this.register.bind(this), {
      authenticate: false,
    });

    this.registerRoute('post', '/register/imported', this.registerImported.bind(this));

    this.registerRoute('post', '/token', this.token.bind(this), {
      authenticate: false,
    });

    this.registerRoute('post', '/reset-password/temporary-password-guid/:temporaryPasswordGuid', this.resetPassword.bind(this), {
      authenticate: false,
    });

    this.registerRoute('post', '/refresh', this.refresh.bind(this), {
      authenticate: false,
    });
    this.registerRoute('get', '/retrieve/imported/:temporaryPasswordGuid', this.retrieveImported.bind(this), {
      authenticate: false,
    });
  }

  public token: DawahRequestHandler<
    any,
    { accessToken: string; refreshToken: string; user: UserDto },
    LoginRequestDto | ClientCredentialsDto
  > = async (req, res) => {
    const loginResponse = await this.generateTokenUserCase.execute(req.body);
    res.json(loginResponse);
  }

  public refresh: DawahRequestHandler<
    any,
    { accessToken: string; user: UserDto },
    AccessTokenRequestDto
  > = async (req, res) => {
    const loginResponse = await this.refreshAccessTokenUseCase.execute(req.body.refreshToken);
    res.json(loginResponse);
  }

  public resetPassword: DawahRequestHandler<
    { temporaryPasswordGuid: string },
    ResetUserPasswordResponseDto,
    { newPassword: string }
  > = async (req, res) => {
    const { temporaryPasswordGuid } = req.params;
    const { newPassword } = req.body;
    const result = await this.resetUserPasswordUseCase.execute(temporaryPasswordGuid, newPassword);
    res.json(result);
  }

  public register: DawahRequestHandler<
    any,
    RegisterUserResponseDto,
    RegisterUserDto
  > = async (req, res) => {
    const { email, username, password } = req.body;
    const registerResponse = await this.registerUserUseCase.execute(email, username, password);
    res.status(201).json(registerResponse);
  }
  public registerImported: DawahRequestHandler<
    any,
    RegisterUserResponseDto,
    RegisterUserDto
  > = async (req, res) => {
    const payload = req.user as (RequestWithUser['user'] & { imported?: boolean }) | undefined;

    if (!payload?.imported) {
      res.status(403).json({ message: 'Invalid imported registration token' });
      return;
    }

    const { email, username, password } = req.body;
    const registerResponse = await this.registerUserUseCase.execute(email, username, password);

    res.status(201).json(registerResponse);
  }
  
public retrieveImported: DawahRequestHandler<
  { temporaryPasswordGuid: string },
  any
> = async (req, res) => {
  if (!this.retrieveImportedUseCase) {
    res.status(500).json({ message: 'Not configured' });
    return;
  }

  const dto = await this.retrieveImportedUseCase.execute(req.params.temporaryPasswordGuid);

  // sign a short-lived access token for registration flow
  const signed = this.jwtService.signTokenWithExtraClaims(dto.id.toString(), [], 'access', undefined, { imported: true });

  res.json({ username: dto.username, token: signed.token, expiresIn: signed.expiresIn });
}
}
