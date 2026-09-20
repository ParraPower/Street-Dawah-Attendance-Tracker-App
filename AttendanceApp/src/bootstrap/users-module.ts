import { DataSource } from "typeorm";
import { UsersController } from "../features/users/infrastructure/http/controllers/users-controller";
import { UserEntity } from "@attendance/features/users/domain/entities/user-entity";
import { UserRepository } from "@attendance/features/users/infrastructure/persistence/typeorm/user-repository";
import { UserService } from "@attendance/features/users/domain/services/user-service";
import { OnboardUseCase } from "@attendance/features/users/application/use-cases/onboard.usecase";
import { apiClientProvider } from "../infrastructure/api";
import { AttendanceAppJwtService } from "@attendance/infrastructure/auth/jwt-service";
import { KeyCacheService, ScopeService, MobileService } from "app-framework";

export function buildUsersController(dataSource: DataSource): UsersController {
  const repository = new UserRepository(dataSource.getRepository(UserEntity));
  const service = new UserService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  const mobileService = new MobileService();

  const onboardUseCase = new OnboardUseCase(service, repository, mobileService, apiClientProvider);

  return new UsersController(scopeService, onboardUseCase, jwtService);
}
