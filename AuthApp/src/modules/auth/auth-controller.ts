import { Router } from 'express';
import { AuthService } from './auth-service';
import { mapper } from '../../mapping/mapper';
import { UserDto } from '../../dtos/user/user.dto';
import { createUserProfile } from '../../mapping/profiles/user-profile';

const router = Router();
const service = new AuthService();
createUserProfile();

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await service.register(email, username, password);
    const userDto = mapper.map(user, Object.getPrototypeOf(user).constructor, UserDto);
    res.status(201).json(userDto);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, access, refresh } = await service.login(email, password);

    const userDto = mapper.map(user, Object.getPrototypeOf(user).constructor, UserDto);

    res.json({
      accessToken: access.token,
      accessTokenExpiresIn: access.expiresIn,
      refreshToken: refresh.token,
      refreshTokenExpiresIn: refresh.expiresIn,
      user: userDto,
    });
  } catch (err: any) {
    console.error(err);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

export const AuthController = router;

