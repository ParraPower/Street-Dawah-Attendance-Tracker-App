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
import { buildLocationController } from './bootstrap/location-module';
import { buildSessionController } from './bootstrap/session-module';
import { buildSessionOccurrenceController } from './bootstrap/session-occurrence-module';
import { buildSessionAttendanceController } from './bootstrap/session-attendance-module';
import { buildMembershipController } from './bootstrap/membership-module';
import { buildUserMembershipController } from './bootstrap/user-membership-module';
import { buildDawahDayController } from './bootstrap/dawah-day-module';
import { buildEmirDateAvailabilityController } from './bootstrap/emir-date-availability-module';
import { buildEmirSessionPreferenceController } from './bootstrap/emir-session-preference-module';

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
    const LocationController = buildLocationController(dataSource);
    const SessionController = buildSessionController(dataSource);
    const SessionOccurrenceController = buildSessionOccurrenceController(dataSource);
    const SessionAttendanceController = buildSessionAttendanceController(dataSource);
    const MembershipController = buildMembershipController(dataSource);
    const UserMembershipController = buildUserMembershipController(dataSource);
    const DawahDayController = buildDawahDayController(dataSource);
    const EmirDateAvailabilityController = buildEmirDateAvailabilityController(dataSource);
    const EmirSessionPreferenceController = buildEmirSessionPreferenceController(dataSource);

    app.use('/import', ImportController.router);
    app.use('/locations', LocationController.router);
    app.use('/sessions', SessionController.router);
    app.use('/session-occurrences', SessionOccurrenceController.router);
    app.use('/session-attendances', SessionAttendanceController.router);
    app.use('/memberships', MembershipController.router);
    app.use('/user-memberships', UserMembershipController.router);
    app.use('/dawah-days', DawahDayController.router);
    app.use('/emir-date-availabilities', EmirDateAvailabilityController.router);
    app.use('/emir-session-preferences', EmirSessionPreferenceController.router);

    // Centralized error handler (must be last)
    app.use(registerErrors());
}
// // Centralized error handler (must be last)
// app.use(errorHandler);
