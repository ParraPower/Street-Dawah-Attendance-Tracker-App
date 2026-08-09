import { DataSource } from "typeorm";
import { KeyCacheService, ScopeService } from "app-framework";
import { CreateUserMembershipUseCase } from "../features/user-memberships/application/use-cases/create-user-membership.use-case";
import { CreateBulkUserMembershipsUseCase } from "../features/user-memberships/application/use-cases/create-bulk-user-memberships.use-case";
import { DeleteUserMembershipUseCase } from "../features/user-memberships/application/use-cases/delete-user-membership.use-case";
import { GetUserMembershipUseCase } from "../features/user-memberships/application/use-cases/get-user-membership.use-case";
import { GetUserMembershipsUseCase } from "../features/user-memberships/application/use-cases/get-user-memberships.use-case";
import { GetMembershipsByUserUseCase } from "../features/user-memberships/application/use-cases/get-memberships-by-user.use-case";
import { GetUsersByMembershipUseCase } from "../features/user-memberships/application/use-cases/get-users-by-membership.use-case";
import { UpdateUserMembershipUseCase } from "../features/user-memberships/application/use-cases/update-user-membership.use-case";
import { UserMembershipEntity } from "../features/user-memberships/domain/entities/user-membership-entity";
import { UserMembershipService } from "../features/user-memberships/domain/services/user-membership-service";
import { UserMembershipRepository } from "../features/user-memberships/infrastructure/persistence/typeorm/user-membership-repository";
import { UserMembershipController } from "../features/user-memberships/interface/controllers/user-membership-controller";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";

export function buildUserMembershipController(dataSource: DataSource): UserMembershipController {
  const repository = new UserMembershipRepository(dataSource.getRepository(UserMembershipEntity));
  const service = new UserMembershipService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new UserMembershipController(
    scopeService,
    new CreateUserMembershipUseCase(repository, service),
    new CreateBulkUserMembershipsUseCase(repository, service),
    new GetUserMembershipUseCase(repository),
    new GetUserMembershipsUseCase(repository),
    new GetMembershipsByUserUseCase(repository),
    new GetUsersByMembershipUseCase(repository),
    new UpdateUserMembershipUseCase(repository, service),
    new DeleteUserMembershipUseCase(repository),
    jwtService,
  );
}
