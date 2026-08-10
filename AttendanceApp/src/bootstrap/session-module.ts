import { DataSource } from "typeorm";
import { CreateSessionUseCase } from "../features/sessions/application/use-cases/create-session.use-case";
import { DeleteSessionUseCase } from "../features/sessions/application/use-cases/delete-session.use-case";
import { GetSessionUseCase } from "../features/sessions/application/use-cases/get-session.use-case";
import { GetSessionsUseCase } from "../features/sessions/application/use-cases/get-sessions.use-case";
import { UpdateSessionUseCase } from "../features/sessions/application/use-cases/update-session.use-case";
import { SessionEntity } from "../features/sessions/domain/entities/session-entity";
import { SessionService } from "../features/sessions/domain/services/session-service";
import { SessionRepository } from "../features/sessions/infrastructure/persistence/typeorm/session-repository";
import { SessionController } from "../features/sessions/interface/controllers/session-controller";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";
import { KeyCacheService, ScopeService } from "app-framework";

export function buildSessionController(dataSource: DataSource): SessionController {
  const repository = new SessionRepository(dataSource.getRepository(SessionEntity));
  const service = new SessionService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new SessionController(
    scopeService,
    new CreateSessionUseCase(repository, service),
    new GetSessionUseCase(repository),
    new GetSessionsUseCase(repository),
    new UpdateSessionUseCase(repository, service),
    new DeleteSessionUseCase(repository),
    jwtService,
  );
}
