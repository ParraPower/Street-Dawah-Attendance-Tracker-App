
import { Router } from 'express';
import { DawahRequestHandler } from '@/core/requests/dawah-request-handler';
import { UserDto } from '../../../../dtos/user/user.dto';
import { RegisterUserResponseDto } from '../../application/dtos/register-user.dto';
import { ClientCredentialsDto } from '../../application/dtos/client-credentials-token-request.dto';
import { GenerateTokenUseCase, RegisterUserUseCase } from '@/features/auth/application/use-cases/index';
import { LoginRequestDto } from '@/features/auth/application/dtos/login-request.dto';

export class AuthController {
  public readonly router = Router();

  constructor(
    private readonly generateTokenUserCase: GenerateTokenUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase) {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/token', this.token.bind(this)); 
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
