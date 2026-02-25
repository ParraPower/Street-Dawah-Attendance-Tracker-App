
import { Router } from 'express';
import { DawahRequestHandler } from '@/core/requests/dawah-request-handler';
import { AuthService } from './auth-service';
import { UserDto } from '../../dtos/user/user.dto';
import { RegisterUserResponseDto } from './dto/register-user.dto';
import { ClientCredentialsDto } from './dto/client-credentials.dto';

export class AuthController {
  public readonly router = Router();

  constructor(private readonly authService: AuthService) {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this)); 
  }

  public login: DawahRequestHandler<
    any,
    { accessToken: string; refreshToken: string; user: UserDto },
    { email: string; password: string }
  > = async (req, res) => {
    const { email, password } = req.body;
    try {
      const loginResponse = await this.authService.login(email, password); 
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
      const registerResponse = await this.authService.register(email, username, password); 
      res.status(201).json(registerResponse);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // generate method in same structure as login and register which issues client credentials token based on clientId and clientSecret
  public issueClientCredentialsToken: DawahRequestHandler<
    any, 
    { accessToken: string; expiresIn: number },
    ClientCredentialsDto
  > = async (req, res) => { 
    const clientCredentials = req.body;
    try {
      const token = await this.authService.generateTokenClientCredentials(clientCredentials);
      if (token) {
        res.json({ accessToken: token.accessToken, expiresIn: token.expiresIn });
      } else {           
        res.status(401).json({ error: 'Invalid client credentials' });  
      }
    } catch (err: any) {        
      console.error(err); 
      res.status(500).json({ error: 'Internal server error' });
    }   
  }
}


// const router = Router();
// const service = new AuthService();
// createUserProfile();

// router.post('/register', async (req, res) => {
//   const { email, username, password } = req.body;
//   try {
//     const user = await service.register(email, username, password);
//     const userDto = mapper.map(user, Object.getPrototypeOf(user).constructor, UserDto);
//     res.status(201).json(userDto);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const { user, access, refresh } = await service.login(email, password);

//     const userDto = mapper.map(user, Object.getPrototypeOf(user).constructor, UserDto);

//     res.json({
//       accessToken: access.token,
//       accessTokenExpiresIn: access.expiresIn,
//       refreshToken: refresh.token,
//       refreshTokenExpiresIn: refresh.expiresIn,
//       user: userDto,
//     });
//   } catch (err: any) {
//     console.error(err);
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// });


// export const AuthController = router;
