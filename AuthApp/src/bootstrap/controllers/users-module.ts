import { DataSource } from 'typeorm';
import { UsersController } from '../../features/users/infrastructure/http/users-controller';
import { UserRepository } from '@/features/users/infrastructure/persistence/typeorm/user-repository';
import { UserEntity } from '@/features/users/domain/entities/user-entity';
import { UserService } from '@/modules/user/user-service';
import { UserService as FeatureUserService } from '@/features/users/domain/services/user-service';
import { PasswordService } from '@/features/auth/domains/services/password-service';
import { CreateBulkUsersUseCase } from '@/features/users/application/use-cases/create-bulk-users.usecase';
import { BcryptHasherService } from '@/shared/infrastructure/password/bcrypt-hasher-service';
import { ScopeService } from '@/features/auth/domains/services/scope-service';


export function buildUsersController(dataSource: DataSource) {
  // 1. Infrastructure
  const userRepo = new UserRepository(
    dataSource.getRepository(UserEntity)
  );

  const passwordService = new PasswordService();
  const bcryptHasherService = new BcryptHasherService()
  const scopeService = new ScopeService()

  // 2. Domain services
  const userService = new UserService();
  const featureUserService = new FeatureUserService(passwordService)

  // 3. Controller
  return new UsersController(
    new CreateBulkUsersUseCase(featureUserService, userRepo, bcryptHasherService, passwordService, scopeService),
    userService
  );
}
