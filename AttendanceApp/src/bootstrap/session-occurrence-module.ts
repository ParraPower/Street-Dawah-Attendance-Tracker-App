import { DataSource } from "typeorm";
import { CreateSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/create-session-occurrence.use-case";
import { DeleteSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/delete-session-occurrence.use-case";
import { GetSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/get-session-occurrence.use-case";
import { GetSessionOccurrencesUseCase } from "../features/session-occurrences/application/use-cases/get-session-occurrences.use-case";
import { UpdateSessionOccurrenceUseCase } from "../features/session-occurrences/application/use-cases/update-session-occurrence.use-case";
import { SessionOccurrenceEntity } from "../features/session-occurrences/domain/entities/session-occurrence-entity";
import { SessionOccurrenceService } from "../features/session-occurrences/domain/services/session-occurrence-service";
import { SessionOccurrenceRepository } from "../features/session-occurrences/infrastructure/persistence/typeorm/session-occurrence-repository";
import { SessionOccurrenceController } from "../features/session-occurrences/interface/controllers/session-occurrence-controller";
import { SessionOccurrenceAuthorizationService } from "../features/session-occurrences/application/authorization/session-occurrence-authorization.service";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";
import { KeyCacheService, ScopeService } from "app-framework";

export function buildSessionOccurrenceController(dataSource: DataSource): SessionOccurrenceController {
  const repository = new SessionOccurrenceRepository(dataSource.getRepository(SessionOccurrenceEntity));
  const service = new SessionOccurrenceService();
  const authorization = new SessionOccurrenceAuthorizationService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new SessionOccurrenceController(
    scopeService,
    new CreateSessionOccurrenceUseCase(repository, service, authorization),
    new GetSessionOccurrenceUseCase(repository, authorization),
    new GetSessionOccurrencesUseCase(repository, authorization),
    new UpdateSessionOccurrenceUseCase(repository, service, authorization),
    new DeleteSessionOccurrenceUseCase(repository),
    jwtService,
  );
}