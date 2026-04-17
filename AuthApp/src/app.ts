import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { buildAuthController } from './bootstrap/controllers/auth-module';
import { JwksController } from './features/auth/infrastructure/http/jwks-controller';
import { buildClientCredentialsController } from './bootstrap/controllers/client-credentials-module';
import { buildUsersController } from './bootstrap/controllers/users-module';
import { registerProfiles } from './shared/infrastructure/mapping/register-profiles';
import { DataSource } from 'typeorm/data-source/DataSource';
import { globalErrorHandler } from './shared/infrastructure/middleware/global-error-handler';

export const app = express();

registerProfiles();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

export function buildControllers(app: Express, dataSource: DataSource) {
  const AuthController = buildAuthController(dataSource);
  const ClientCredentialsController = buildClientCredentialsController(dataSource);
  const UsersController = buildUsersController(dataSource);

  app.use('/user', UsersController.router);
  app.use('/auth', AuthController.router);
  app.use('/client-credentials', ClientCredentialsController.router);
  app.use('/', JwksController);

  app.use(globalErrorHandler);
}
