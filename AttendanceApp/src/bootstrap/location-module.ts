import { DataSource } from "typeorm";
import { CreateBulkLocationsUseCase } from "../features/locations/application/use-cases/create-bulk-locations.use-case";
import { CreateLocationUseCase } from "../features/locations/application/use-cases/create-location.use-case";
import { DeleteLocationUseCase } from "../features/locations/application/use-cases/delete-location.use-case";
import { GetLocationUseCase } from "../features/locations/application/use-cases/get-location.use-case";
import { GetLocationsUseCase } from "../features/locations/application/use-cases/get-locations.use-case";
import { UpdateLocationUseCase } from "../features/locations/application/use-cases/update-location.use-case";
import { LocationsController } from "../features/locations/infrastructure/http/controllers/locations-controller";
import { LocationEntity } from "../features/locations/domain/entities/location-entity";
import { LocationRepository } from "../features/locations/infrastructure/persistence/typeorm/location-repository";
import { LocationService } from "../features/locations/domain/services/location-service";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";
import { KeyCacheService, ScopeService } from "app-framework";

export function buildLocationController(dataSource: DataSource): LocationsController {
  const repository = new LocationRepository(dataSource.getRepository(LocationEntity));
  const service = new LocationService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new LocationsController(
    scopeService,
    new CreateLocationUseCase(repository, service),
    new CreateBulkLocationsUseCase(repository, service),
    new GetLocationUseCase(repository),
    new GetLocationsUseCase(repository),
    new UpdateLocationUseCase(repository, service),
    new DeleteLocationUseCase(repository),
    jwtService,
  );
}

