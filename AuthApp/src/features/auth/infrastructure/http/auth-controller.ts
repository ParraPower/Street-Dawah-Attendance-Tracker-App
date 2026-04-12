
import { Router } from 'express';
import { DawahRequestHandler } from '@/core/requests/dawah-request-handler';
import { RegisterUserResponseDto } from '../../application/dtos/register-user.dto';
import { ClientCredentialsDto } from '../../application/dtos/client-credentials-token-request.dto';
import { GenerateTokenUseCase, RegisterUserUseCase } from '@/features/auth/application/use-cases/index';
import { LoginRequestDto } from '@/features/auth/application/dtos/login-request.dto';
import { UserDto } from '@/features/users/application/dtos/user.dto';
import { ResetUserPasswordUseCase } from '../../application/use-cases/reset-user-password.usecase';
import { ResetUserPasswordResponseDto } from '../../application/dtos/reset-user-password.dto';
import { asyncHandler } from '@/shared/infrastructure/middleware/async-handler';

export class AuthController {
  public readonly router = Router();

  constructor(
    private readonly generateTokenUserCase: GenerateTokenUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly resetUserPasswordUseCase: ResetUserPasswordUseCase) {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/token', this.token.bind(this)); 
    this.router.post('/reset-password/temporary-password-guid/:temporaryPasswordGuid', asyncHandler(this.resetPassword.bind(this)))
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
