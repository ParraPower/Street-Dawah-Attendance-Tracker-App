
import { RequestHandler, Router } from 'express';
import { DawahRequestHandler } from '@/core/requests/dawah-request-handler';
import { AuthService } from './auth-service';
import { UserDto } from '../../dtos/user/user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

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
    RegisterUserDto,
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
