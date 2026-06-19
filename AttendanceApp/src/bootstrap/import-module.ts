import { KeyCacheService, ScopeService } from "app-framework";
import { ImportUsersUseCase } from "../features/import/application/use-cases/import-users.usecase";
import { ImportController } from "../features/import/infrastructure/http/import-controller";
import { IApiClientProvider } from "../infrastructure/api";
import { AttendanceAppJwtService } from "@attendance/infrastructure/auth/jwt-service";
import { ImportBulkUsersByFileUseCase } from "@attendance/features/import/application/use-cases/import-bulk-users-by-file.usecase";
import { UserFileParserService } from "@attendance/infrastructure/file/file-parser.service";
import { UploadFileServiceFactory } from "@attendance/infrastructure/file/upload-file-service";
import { ImportUserService } from "@attendance/infrastructure/import/import-user.service";
import { CreateBulkUsersUseCase } from "@attendance/features/users/application/use-cases/create-bulk-users.usecase";
import { UserService } from "@attendance/features/users/domain/services/user-service";
import { UserRepository } from "@attendance/features/users/infrastructure/persistence/typeorm/user-repository";
import { DataSource } from "typeorm";
import { UserEntity } from "@attendance/features/users/domain/entities/user-entity";

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

  // 2. Domain services (reuse from app-framework)
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService()); // Stub implementation, as JWT validation is handled by Auth API middleware
  const fileParserService = new UserFileParserService(); // Assuming this is implemented elsewhere
  const userService = new UserService(); // Assuming this is implemented elsewhere

  // 3. Application services / use cases
  const uploadFileService = new UploadFileServiceFactory();

  // 3. Application use cases
  const createBulkUsersUseCase = new CreateBulkUsersUseCase(userService, userRepository);
  const importUsersUseCase = new ImportUsersUseCase(importUserService, createBulkUsersUseCase, userService);
  const uploadFileUseCase = new ImportBulkUsersByFileUseCase(fileParserService, importUsersUseCase);

  // 4. Controller
  return new ImportController(scopeService, uploadFileService, jwtService, uploadFileUseCase);
}
