import { DataSource } from "typeorm";
import { KeyCacheService, ScopeService } from "app-framework";
import { EmirDateAvailabilityEntity } from "../features/emir-date-availabilities/domain/entities/emir-date-availability-entity";
import { EmirDateAvailabilityRepository } from "../features/emir-date-availabilities/infrastructure/persistence/typeorm/emir-date-availability-repository";
import { EmirDateAvailabilityService } from "../features/emir-date-availabilities/domain/services/emir-date-availability-service";
import { EmirDateAvailabilityController } from "../features/emir-date-availabilities/interface/controllers/emir-date-availability-controller";
import { CreateEmirDateAvailabilityUseCase } from "../features/emir-date-availabilities/application/use-cases/create-emir-date-availability.use-case";
import { DeleteEmirDateAvailabilityUseCase } from "../features/emir-date-availabilities/application/use-cases/delete-emir-date-availability.use-case";
import { GetEmirDateAvailabilityUseCase } from "../features/emir-date-availabilities/application/use-cases/get-emir-date-availability.use-case";
import { GetEmirDateAvailabilitiesUseCase } from "../features/emir-date-availabilities/application/use-cases/get-emir-date-availabilities.use-case";
import { GetEmirDateAvailabilitiesByDateUseCase } from "../features/emir-date-availabilities/application/use-cases/get-emir-date-availabilities-by-date.use-case";
import { GetEmirDateAvailabilitiesByUserUseCase } from "../features/emir-date-availabilities/application/use-cases/get-emir-date-availabilities-by-user.use-case";
import { ToggleEmirDateAvailabilityUseCase } from "../features/emir-date-availabilities/application/use-cases/toggle-emir-date-availability.use-case";
import { UpdateEmirDateAvailabilityUseCase } from "../features/emir-date-availabilities/application/use-cases/update-emir-date-availability.use-case";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";

export function buildEmirDateAvailabilityController(dataSource: DataSource): EmirDateAvailabilityController {
  const repository = new EmirDateAvailabilityRepository(dataSource.getRepository(EmirDateAvailabilityEntity));
  const service = new EmirDateAvailabilityService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new EmirDateAvailabilityController(
    scopeService,
    new CreateEmirDateAvailabilityUseCase(repository, service),
    new GetEmirDateAvailabilityUseCase(repository),
    new GetEmirDateAvailabilitiesUseCase(repository),
    new GetEmirDateAvailabilitiesByUserUseCase(repository),
    new GetEmirDateAvailabilitiesByDateUseCase(repository, service),
    new UpdateEmirDateAvailabilityUseCase(repository, service),
    new ToggleEmirDateAvailabilityUseCase(repository),
    new DeleteEmirDateAvailabilityUseCase(repository),
    jwtService,
  );
}
