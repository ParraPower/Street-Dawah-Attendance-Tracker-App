import { DataSource } from "typeorm";
import { CreateSessionAttendanceUseCase } from "../features/session-attendance/application/use-cases/create-session-attendance.use-case";
import { CreateBulkSessionAttendanceUseCase } from "../features/session-attendance/application/use-cases/create-bulk-session-attendance.use-case";
import { DeleteSessionAttendanceUseCase } from "../features/session-attendance/application/use-cases/delete-session-attendance.use-case";
import { GetSessionAttendanceUseCase } from "../features/session-attendance/application/use-cases/get-session-attendance.use-case";
import { GetSessionAttendancesUseCase } from "../features/session-attendance/application/use-cases/get-session-attendances.use-case";
import { GetSessionAttendanceByOccurrenceUseCase } from "../features/session-attendance/application/use-cases/get-session-attendance-by-occurrence.use-case";
import { GetSessionAttendanceByUserUseCase } from "../features/session-attendance/application/use-cases/get-session-attendance-by-user.use-case";
import { UpdateSessionAttendanceUseCase } from "../features/session-attendance/application/use-cases/update-session-attendance.use-case";
import { SessionAttendanceEntity } from "../features/session-attendance/domain/entities/session-attendance-entity";
import { SessionAttendanceService } from "../features/session-attendance/domain/services/session-attendance-service";
import { SessionAttendanceRepository } from "../features/session-attendance/infrastructure/persistence/typeorm/session-attendance-repository";
import { SessionAttendanceController } from "../features/session-attendance/interface/controllers/session-attendance-controller";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";
import { KeyCacheService, ScopeService } from "app-framework";

export function buildSessionAttendanceController(dataSource: DataSource): SessionAttendanceController {
  const repository = new SessionAttendanceRepository(dataSource.getRepository(SessionAttendanceEntity));
  const service = new SessionAttendanceService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new SessionAttendanceController(
    scopeService,
    new CreateSessionAttendanceUseCase(repository, service),
    new CreateBulkSessionAttendanceUseCase(repository, service),
    new GetSessionAttendanceUseCase(repository),
    new GetSessionAttendancesUseCase(repository),
    new GetSessionAttendanceByOccurrenceUseCase(repository),
    new GetSessionAttendanceByUserUseCase(repository),
    new UpdateSessionAttendanceUseCase(repository, service),
    new DeleteSessionAttendanceUseCase(repository),
    jwtService,
  );
}
