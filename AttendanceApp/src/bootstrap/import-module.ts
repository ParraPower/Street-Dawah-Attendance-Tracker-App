import { KeyCacheService, ScopeService } from "app-framework";
import { ImportUserService } from "../features/import/application/services/import-user.service";
import { ImportUsersUseCase } from "../features/import/application/use-cases/import-users.usecase";
import { ImportController } from "../features/import/infrastructure/http/import-controller";
import { IApiClientProvider } from "../infrastructure/api";
import { AttendanceAppJwtService } from "@attendance/infrastructure/auth/jwt-service";
import { ImportBulkUsersByFileUseCase } from "@attendance/features/import/application/use-cases/import-bulk-users-by-file.usecase";
import { UserFileParserService } from "@attendance/features/import/domain/services/file-parser.service";
import { UploadFileServiceFactory } from "@attendance/infrastructure/file/upload-file-service";

/**
 * Bootstrap function for the Import module
 * Sets up dependency injection and returns the configured ImportController
 *
 * Pattern: Infrastructure → Use Cases → Controller
 */
export function buildImportController(apiClientProvider: IApiClientProvider): ImportController {
  // 1. Infrastructure layer
  const importUserService = new ImportUserService(apiClientProvider);

  // 2. Domain services (reuse from app-framework)
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService()); // Stub implementation, as JWT validation is handled by Auth API middleware
  const fileParserService = new UserFileParserService(); // Assuming this is implemented elsewhere

  // 3. Application services / use cases
  const uploadFileService = new UploadFileServiceFactory();

  // 3. Application use cases
  const importUsersUseCase = new ImportUsersUseCase(importUserService);
  const uploadFileUseCase = new ImportBulkUsersByFileUseCase(fileParserService, importUsersUseCase);

  // 4. Controller
  return new ImportController(scopeService, uploadFileService, jwtService, uploadFileUseCase);
}
