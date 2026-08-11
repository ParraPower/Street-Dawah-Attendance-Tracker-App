import { DataSource } from "typeorm";
import { KeyCacheService, ScopeService } from "app-framework";
import { EmirSessionPreferenceEntity } from "../features/emir-session-preferences/domain/entities/emir-session-preference-entity";
import { EmirSessionPreferenceRepository } from "../features/emir-session-preferences/infrastructure/persistence/typeorm/emir-session-preference-repository";
import { EmirSessionPreferenceService } from "../features/emir-session-preferences/domain/services/emir-session-preference-service";
import { EmirSessionPreferenceController } from "../features/emir-session-preferences/interface/controllers/emir-session-preference-controller";
import { CreateEmirSessionPreferenceUseCase } from "../features/emir-session-preferences/application/use-cases/create-emir-session-preference.use-case";
import { DeleteEmirSessionPreferenceUseCase } from "../features/emir-session-preferences/application/use-cases/delete-emir-session-preference.use-case";
import { GetEmirSessionPreferenceUseCase } from "../features/emir-session-preferences/application/use-cases/get-emir-session-preference.use-case";
import { GetEmirSessionPreferencesUseCase } from "../features/emir-session-preferences/application/use-cases/get-emir-session-preferences.use-case";
import { GetEmirSessionPreferencesByUserUseCase } from "../features/emir-session-preferences/application/use-cases/get-emir-session-preferences-by-user.use-case";
import { GetEmirSessionPreferencesBySessionUseCase } from "../features/emir-session-preferences/application/use-cases/get-emir-session-preferences-by-session.use-case";
import { UpdateEmirSessionPreferenceUseCase } from "../features/emir-session-preferences/application/use-cases/update-emir-session-preference.use-case";
import { AttendanceAppJwtService } from "../infrastructure/auth/jwt-service";

export function buildEmirSessionPreferenceController(dataSource: DataSource): EmirSessionPreferenceController {
  const repository = new EmirSessionPreferenceRepository(dataSource.getRepository(EmirSessionPreferenceEntity));
  const service = new EmirSessionPreferenceService();
  const scopeService = new ScopeService();
  const jwtService = new AttendanceAppJwtService(new KeyCacheService());
  return new EmirSessionPreferenceController(
    scopeService,
    new CreateEmirSessionPreferenceUseCase(repository, service),
    new GetEmirSessionPreferenceUseCase(repository),
    new GetEmirSessionPreferencesUseCase(repository),
    new GetEmirSessionPreferencesByUserUseCase(repository),
    new GetEmirSessionPreferencesBySessionUseCase(repository),
    new UpdateEmirSessionPreferenceUseCase(repository, service),
    new DeleteEmirSessionPreferenceUseCase(repository),
    jwtService,
  );
}
