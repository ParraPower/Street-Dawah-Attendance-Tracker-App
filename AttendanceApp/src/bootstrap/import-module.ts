import { KeyCacheService, ScopeService } from "app-framework";
import { ImportUsersUseCase } from "../features/import/application/use-cases/import-users.usecase";
import { ImportController } from "../features/import/infrastructure/http/import-controller";
import { IApiClientProvider } from "../infrastructure/api";
import { AttendanceAppJwtService } from "@attendance/infrastructure/auth/jwt-service";
import { ImportBulkUsersByFileUseCase } from "@attendance/features/import/application/use-cases/import-bulk-users-by-file.usecase";
import { UserFileParserService } from "../infrastructure/file/user-file-parser.service";
import { LocationFileParserService } from "@attendance/infrastructure/file/location-file-parser.service";
import { UploadFileServiceFactory } from "@attendance/infrastructure/file/upload-file-service";
import { ImportUserService } from "@attendance/infrastructure/import/import-user.service";
import { CreateBulkUsersUseCase } from "@attendance/features/users/application/use-cases/create-bulk-users.usecase";
import { UserService } from "@attendance/features/users/domain/services/user-service";
import { UserRepository } from "@attendance/features/users/infrastructure/persistence/typeorm/user-repository";
import { DataSource } from "typeorm";
import { UserEntity } from "@attendance/features/users/domain/entities/user-entity";
import { LocationEntity } from "@attendance/features/locations/domain/entities/location-entity";
import { LocationRepository } from "@attendance/features/locations/infrastructure/persistence/typeorm/location-repository";
import { LocationService } from "@attendance/features/locations/domain/services/location-service";
import { CreateBulkLocationsUseCase } from "@attendance/features/locations/application/use-cases/create-bulk-locations.use-case";
import { ImportBulkLocationsByFileUseCase } from "@attendance/features/import/application/use-cases/import-bulk-locations-by-file.use-case";
import { SessionFileParserService } from "@attendance/infrastructure/file/session-file-parser.service";
import { SessionEntity } from "@attendance/features/sessions/domain/entities/session-entity";
import { SessionRepository } from "@attendance/features/sessions/infrastructure/persistence/typeorm/session-repository";
import { SessionService } from "@attendance/features/sessions/domain/services/session-service";
import { CreateSessionUseCase } from "@attendance/features/sessions/application/use-cases/create-session.use-case";
import { CreateBulkSessionsUseCase } from "@attendance/features/sessions/application/use-cases/create-bulk-sessions.use-case";
import { ImportBulkSessionsByFileUseCase } from "@attendance/features/import/application/use-cases/import-bulk-sessions-by-file.use-case";
import { MembershipFileParserService } from "@attendance/infrastructure/file/membership-file-parser.service";
import { MembershipEntity } from "@attendance/features/memberships/domain/entities/membership-entity";
import { MembershipRepository } from "@attendance/features/memberships/infrastructure/persistence/typeorm/membership-repository";
import { MembershipService } from "@attendance/features/memberships/domain/services/membership-service";
import { CreateBulkMembershipsUseCase } from "@attendance/features/memberships/application/use-cases/create-bulk-memberships.use-case";
import { ImportBulkMembershipsByFileUseCase } from "@attendance/features/import/application/use-cases/import-bulk-memberships-by-file.use-case";
import { UserMembershipFileParserService } from "@attendance/infrastructure/file/user-membership-file-parser.service";
import { UserMembershipEntity } from "@attendance/features/user-memberships/domain/entities/user-membership-entity";
import { UserMembershipRepository } from "@attendance/features/user-memberships/infrastructure/persistence/typeorm/user-membership-repository";
import { UserMembershipService } from "@attendance/features/user-memberships/domain/services/user-membership-service";
import { CreateBulkUserMembershipsUseCase } from "@attendance/features/user-memberships/application/use-cases/create-bulk-user-memberships.use-case";
import { ImportBulkUserMembershipsByFileUseCase } from "@attendance/features/import/application/use-cases/import-bulk-user-memberships-by-file.use-case";

/**
 * Bootstrap function for the Import module
 * Sets up dependency injection and returns the configured ImportController
 *
 * Pattern: Infrastructure → Use Cases → Controller
 */
export function buildImportController(apiClientProvider: IApiClientProvider, dataSource: DataSource): ImportController {
  // 1. Infrastructure layer
  const importUserService = new ImportUserService(apiClientProvider);
  const userRepository = new UserRepository(dataSource.getRepository(UserEntity)); // Assuming this is implemented elsewhere
  const locationRepository = new LocationRepository(dataSource.getRepository(LocationEntity));
  const sessionRepository = new SessionRepository(dataSource.getRepository(SessionEntity));
  const membershipRepository = new MembershipRepository(dataSource.getRepository(MembershipEntity));
  const userMembershipRepository = new UserMembershipRepository(dataSource.getRepository(UserMembershipEntity));

  // 2. Domain services (reuse from app-framework)
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService()); // Stub implementation, as JWT validation is handled by Auth API middleware
  const fileParserService = new UserFileParserService(); // Assuming this is implemented elsewhere
  const locationFileParserService = new LocationFileParserService();
  const userService = new UserService(); // Assuming this is implemented elsewhere
  const locationService = new LocationService();
  const sessionService = new SessionService();
  const membershipService = new MembershipService();
  const userMembershipService = new UserMembershipService();

  // 3. Application services / use cases
  const uploadFileService = new UploadFileServiceFactory();

  // 3. Application use cases
  const createBulkUsersUseCase = new CreateBulkUsersUseCase(userService, userRepository);
  const importUsersUseCase = new ImportUsersUseCase(importUserService, createBulkUsersUseCase, userService);
  const uploadFileUseCase = new ImportBulkUsersByFileUseCase(fileParserService, importUsersUseCase);
  const importLocationsUseCase = new ImportBulkLocationsByFileUseCase(
    locationFileParserService,
    new CreateBulkLocationsUseCase(locationRepository, locationService)
  );
  const importSessionsUseCase = new ImportBulkSessionsByFileUseCase(
    new SessionFileParserService(),
    new CreateBulkSessionsUseCase(new CreateSessionUseCase(sessionRepository, sessionService))
  );
  const importMembershipsUseCase = new ImportBulkMembershipsByFileUseCase(
    new MembershipFileParserService(),
    new CreateBulkMembershipsUseCase(membershipRepository, membershipService)
  );
  const importUserMembershipsUseCase = new ImportBulkUserMembershipsByFileUseCase(
    new UserMembershipFileParserService(),
    new CreateBulkUserMembershipsUseCase(userMembershipRepository, userMembershipService),
  );

  // 4. Controller
  return new ImportController(scopeService, uploadFileService, jwtService, uploadFileUseCase, importLocationsUseCase, importSessionsUseCase, importMembershipsUseCase, importUserMembershipsUseCase);
}
