import { DataSource } from "typeorm";
import { CreateSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/create-session-occurrence.use-case";
import { CreateBulkSessionOccurrencesUseCase } from "../features/session-occurrences/application/use-cases/create-bulk-session-occurrences.use-case";
import { DeleteSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/delete-session-occurrence.use-case";
import { GetSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/get-session-occurrence.use-case";
import { GetSessionOccurrencesUseCase } from "../features/session-occurrences/application/use-cases/get-session-occurrences.use-case";
import { GetCurrentWeekSessionOccurrencesUseCase } from "../features/session-occurrences/application/use-cases/get-current-week-session-occurrences.use-case";
import { UpdateSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/update-session-occurrence.use-case";
import { CreateThisWeeksSessionOccurrencesUseCase } from "../features/session-occurrences/application/use-cases/create-this-weeks-session-occurrences.use-case";
import { SessionOccurrenceEntity } from "../features/session-occurrences/domain/entities/session-occurrence-entity";
import { SessionOccurrenceService } from "../features/session-occurrences/domain/services/session-occurrence-service";
import { SessionOccurrenceRepository } from "../features/session-occurrences/infrastructure/persistence/typeorm/session-occurrence-repository";
import { SessionOccurrenceController } from "../features/session-occurrences/infrastructure/http/session-occurrence-controller";
import { SessionOccurrenceAuthorizationService } from "../features/session-occurrences/application/authorization/session-occurrence-authorization.service";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";
import { KeyCacheService, ScopeService } from "app-framework";
import { SessionEntity } from "../features/sessions/domain/entities/session-entity";
import { SessionRepository } from "../features/sessions/infrastructure/persistence/typeorm/session-repository";
import { EmirSessionPreferenceEntity } from "../features/emir-session-preferences/domain/entities/emir-session-preference-entity";
import { EmirSessionPreferenceRepository } from "../features/emir-session-preferences/infrastructure/persistence/typeorm/emir-session-preference-repository";
import { EmirDateAvailabilityEntity } from "../features/emir-date-availabilities/domain/entities/emir-date-availability-entity";
import { EmirDateAvailabilityRepository } from "../features/emir-date-availabilities/infrastructure/persistence/typeorm/emir-date-availability-repository";
import { MembershipEntity } from "../features/memberships/domain/entities/membership-entity";
import { MembershipRepository } from "../features/memberships/infrastructure/persistence/typeorm/membership-repository";
import { UserMembershipEntity } from "../features/user-memberships/domain/entities/user-membership-entity";
import { UserMembershipRepository } from "../features/user-memberships/infrastructure/persistence/typeorm/user-membership-repository";

export function buildSessionOccurrenceController(dataSource: DataSource): SessionOccurrenceController {
  const repository = new SessionOccurrenceRepository(dataSource.getRepository(SessionOccurrenceEntity));
  const sessionRepository = new SessionRepository(dataSource.getRepository(SessionEntity));
  const preferenceRepository = new EmirSessionPreferenceRepository(dataSource.getRepository(EmirSessionPreferenceEntity));
  const availabilityRepository = new EmirDateAvailabilityRepository(dataSource.getRepository(EmirDateAvailabilityEntity));
  const membershipRepository = new MembershipRepository(dataSource.getRepository(MembershipEntity));
  const userMembershipRepository = new UserMembershipRepository(dataSource.getRepository(UserMembershipEntity));
  const service = new SessionOccurrenceService();
  const authorization = new SessionOccurrenceAuthorizationService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new SessionOccurrenceController(
    scopeService,
    new CreateSessionOccurrenceUseCase(repository, service, authorization),
    new CreateBulkSessionOccurrencesUseCase(repository, service, authorization),
    new CreateThisWeeksSessionOccurrencesUseCase(repository, sessionRepository, preferenceRepository, availabilityRepository, membershipRepository, userMembershipRepository, authorization),
    new GetSessionOccurrenceUseCase(repository, authorization),
    new GetSessionOccurrencesUseCase(repository, authorization),
    new GetCurrentWeekSessionOccurrencesUseCase(repository, authorization),
    new UpdateSessionOccurrenceUseCase(repository, service, authorization),
    new DeleteSessionOccurrenceUseCase(repository),
    jwtService,
  );
}