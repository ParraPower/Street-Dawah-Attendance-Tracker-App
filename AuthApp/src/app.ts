import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { UserController } from './modules/user/user-controller';
import { AuthController } from './modules/auth/auth-controller';
import { JwksController } from './modules/jwks/jwks-controller';
import { authenticate } from './modules/auth/auth-middleware';
import { registerProfiles } from './mapping/register-profiles';


export const app = express();

registerProfiles();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/user', UserController);
app.use('/auth', AuthController);
app.use('/', JwksController);

// example protected route
app.get('/me', authenticate, (req, res) => {
  res.json({ user: (req as any).user });
});
