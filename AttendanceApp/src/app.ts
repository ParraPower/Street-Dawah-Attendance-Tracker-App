import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from "@attendance/infrastructure/config/env";
import { registerProfiles } from '@attendance/infrastructure/mapping/register-profiles';
import { DataSource } from 'typeorm/data-source/DataSource';
import { buildImportController } from './bootstrap/import-module';
import { registerErrors } from './infrastructure/errors/register-errors';
import { apiClientProvider } from './infrastructure/api';

export const app = express();

registerProfiles();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.logFormat ?? "dev"));

export function buildControllers(app: Express, dataSource: DataSource) {
    const ImportController = buildImportController(apiClientProvider, dataSource);

    app.use('/import', ImportController.router);

    // Centralized error handler (must be last)
    app.use(registerErrors());
}
// // Centralized error handler (must be last)
// app.use(errorHandler);
