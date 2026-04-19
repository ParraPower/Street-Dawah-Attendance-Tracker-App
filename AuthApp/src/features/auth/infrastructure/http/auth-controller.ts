
import { Router } from 'express';
import { DawahRequestHandler } from '@/shared/infrastructure/http/dawah-request-handler';
import { RegisterUserResponseDto } from '../../application/dtos/register-user.dto';
import { ClientCredentialsDto } from '../../application/dtos/client-credentials-token-request.dto';
import { GenerateTokenUseCase, RegisterUserUseCase } from '@/features/auth/application/use-cases/index';
import { LoginRequestDto } from '@/features/auth/application/dtos/login-request.dto';
import { UserDto } from '@/features/users/application/dtos/user.dto';
import { ResetUserPasswordUseCase } from '../../application/use-cases/reset-user-password.usecase';
import { ResetUserPasswordResponseDto } from '../../application/dtos/reset-user-password.dto';
import { BaseController } from '@/shared/infrastructure/http/base-controller';
import { ScopeService } from '../../domain/services/scope-service';
import { IAuthAppJwtService } from '../../domain/services/jwt-service';
import { env } from '@/shared/infrastructure/config/env';

export class AuthController extends BaseController {
  public readonly router = Router();

  constructor(
    protected readonly jwtService: IAuthAppJwtService,
    protected readonly scopeService: ScopeService,
    private readonly generateTokenUserCase: GenerateTokenUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly resetUserPasswordUseCase: ResetUserPasswordUseCase) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.jwtDefaultAudience });

    this.registerRoute('post', '/register', this.register.bind(this), {
      authenticate: false,
    });

    this.registerRoute('post', '/token', this.token.bind(this), {
      authenticate: false,
    });

    this.registerRoute('post', '/reset-password/temporary-password-guid/:temporaryPasswordGuid', this.resetPassword.bind(this), {
      authenticate: false,
    });

  }

  public token: DawahRequestHandler<
    any,
    { accessToken: string; refreshToken: string; user: UserDto },
    LoginRequestDto | ClientCredentialsDto
  > = async (req, res) => {

    try {
      const loginResponse = await this.generateTokenUserCase.execute(req.body);
      res.json(loginResponse);
    } catch (err: any) {
      console.error(err);
      res.status(401).json({ error: 'Invalid credentials' });
    }
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
    { email: string; username: string; password: string }
  > = async (req, res) => {
    const { email, username, password } = req.body;
    try {
      const registerResponse = await this.registerUserUseCase.execute(email, username, password);
      res.status(201).json(registerResponse);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
