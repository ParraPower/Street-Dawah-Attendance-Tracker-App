import { DataSource } from "typeorm";
import { KeyCacheService, ScopeService } from "app-framework";
import { DawahDayEntity } from "../features/dawah-days/domain/entities/dawah-day-entity";
import { DawahDayRepository } from "../features/dawah-days/infrastructure/persistence/typeorm/dawah-day-repository";
import { DawahDayService } from "../features/dawah-days/domain/services/dawah-day-service";
import { DawahDayController } from "../features/dawah-days/interface/controllers/dawah-day-controller";
import { CreateDawahDayUseCase } from "../features/dawah-days/application/use-cases/create-dawah-day.use-case";
import { DeleteDawahDayUseCase } from "../features/dawah-days/application/use-cases/delete-dawah-day.use-case";
import { GetActiveDawahDaysUseCase } from "../features/dawah-days/application/use-cases/get-active-dawah-days.use-case";
import { GetAvailableDawahDaysUseCase } from "../features/dawah-days/application/use-cases/get-available-dawah-days.use-case";
import { GetDawahDayByDayOfWeekUseCase } from "../features/dawah-days/application/use-cases/get-dawah-day-by-day-of-week.use-case";
import { GetDawahDayUseCase } from "../features/dawah-days/application/use-cases/get-dawah-day.use-case";
import { GetDawahDaysUseCase } from "../features/dawah-days/application/use-cases/get-dawah-days.use-case";
import { UpdateDawahDayUseCase } from "../features/dawah-days/application/use-cases/update-dawah-day.use-case";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";

export function buildDawahDayController(dataSource: DataSource): DawahDayController {
  const repository = new DawahDayRepository(dataSource.getRepository(DawahDayEntity));
  const service = new DawahDayService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new DawahDayController(
    scopeService,
    new CreateDawahDayUseCase(repository, service),
    new GetDawahDayUseCase(repository),
    new GetDawahDaysUseCase(repository),
    new GetActiveDawahDaysUseCase(repository),
    new GetAvailableDawahDaysUseCase(repository),
    new GetDawahDayByDayOfWeekUseCase(repository, service),
    new UpdateDawahDayUseCase(repository),
    new DeleteDawahDayUseCase(repository),
    jwtService,
  );
}
