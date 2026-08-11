import { DataSource } from "typeorm";
import { KeyCacheService, ScopeService } from "app-framework";
import { MembershipEntity } from "../features/memberships/domain/entities/membership-entity";
import { MembershipRepository } from "../features/memberships/infrastructure/persistence/typeorm/membership-repository";
import { MembershipService } from "../features/memberships/domain/services/membership-service";
import { MembershipController } from "../features/memberships/infrastructure/http/membership-controller";
import { CreateMembershipUseCase } from "../features/memberships/application/use-cases/create-membership.use-case";
import { CreateBulkMembershipsUseCase } from "../features/memberships/application/use-cases/create-bulk-memberships.use-case";
import { GetMembershipUseCase } from "../features/memberships/application/use-cases/get-membership.use-case";
import { GetMembershipsUseCase } from "../features/memberships/application/use-cases/get-memberships.use-case";
import { UpdateMembershipUseCase } from "../features/memberships/application/use-cases/update-membership.use-case";
import { DeleteMembershipUseCase } from "../features/memberships/application/use-cases/delete-membership.use-case";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";

export function buildMembershipController(dataSource: DataSource): MembershipController {
  const repository = new MembershipRepository(dataSource.getRepository(MembershipEntity));
  const service = new MembershipService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new MembershipController(scopeService, new CreateMembershipUseCase(repository, service), new CreateBulkMembershipsUseCase(repository, service), new GetMembershipUseCase(repository), new GetMembershipsUseCase(repository), new UpdateMembershipUseCase(repository, service), new DeleteMembershipUseCase(repository), jwtService);
}
