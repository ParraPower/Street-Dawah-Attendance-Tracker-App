import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { UserController } from './modules/user/user-controller';
import { buildAuthController } from './modules/auth/auth-module';
import { JwksController } from './modules/jwks/jwks-controller';
import { authenticate } from './modules/auth/auth-middleware';
import { registerProfiles } from './mapping/register-profiles';
import { DataSource } from 'typeorm/data-source/DataSource';

export const app = express();

registerProfiles();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

export function buildControllers(app: Express, dataSource: DataSource) {
  const AuthController = buildAuthController(dataSource);

  app.use('/user', UserController);
  app.use('/auth', AuthController.router);
  app.use('/', JwksController);

  // example protected route
  app.get('/me', authenticate, (req, res) => {
    res.json({ user: (req as any).user });
  });
}
