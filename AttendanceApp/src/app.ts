import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from "@attendance/infrastructure/config/env";
import { registerProfiles } from '@attendance/mapping/register-profiles';

export const app = express();

registerProfiles();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.logFormat ?? "dev"));



// // Centralized error handler (must be last)
// app.use(errorHandler);
