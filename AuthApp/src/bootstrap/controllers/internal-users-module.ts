import { DataSource } from 'typeorm';
import { InternalUsersController } from '../../features/users/infrastructure/http/controllers/internal-users.controller';
import { UserRepository } from '@auth/features/users/infrastructure/persistence/typeorm/user-repository';
import { UserEntity } from '@auth/features/users/domain/entities/user-entity';
import { HandleOnboardingEventUseCase } from '@auth/features/users/application/use-cases/handle-onboarding-event.use-case';
import { ScopeService } from 'app-framework';
import { AuthAppJwtService } from '@auth/shared/infrastructure/auth/jwt-service';
import { KeyCacheService } from '@auth/features/auth/infrastructure/jwt/key-cache.service';

export function buildInternalUsersController(dataSource: DataSource) {
  const userRepo = new UserRepository(dataSource.getRepository(UserEntity));
  const handleOnboardingEventUseCase = new HandleOnboardingEventUseCase(userRepo);

  const scopeService = new ScopeService();
  const jwtService = new AuthAppJwtService(new KeyCacheService());

  return new InternalUsersController(jwtService, scopeService, handleOnboardingEventUseCase);
}
