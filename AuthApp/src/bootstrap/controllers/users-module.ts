import { DataSource } from 'typeorm';
import { UsersController } from '../../features/users/infrastructure/http/users-controller';
import { UserRepository } from '@/features/users/infrastructure/persistence/typeorm/user-repository';
import { UserEntity } from '@/features/users/domain/entities/user-entity';
import { UserService as FeatureUserService } from '@/features/users/domain/services/user-service';
import { PasswordService } from '@/features/auth/domain/services/password-service';
import { CreateBulkUsersUseCase } from '@/features/users/application/use-cases/create-bulk-users.usecase';
import { BcryptHasherService } from '@/shared/infrastructure/password/bcrypt-hasher-service';
import { ScopeService } from '@/features/auth/domain/services/scope-service';
import { AuthService } from '@/features/auth/domain/services/auth-service';
import { CreateUserUseCase } from '@/features/users/application/use-cases/create-user.usecase';
import { GetUserUseCase } from '@/features/users/application/use-cases/get-user.usecase';
import { JwtService } from '@/shared/infrastructure/auth/jwt-service';
import { KeyCacheService } from '@/features/auth/infrastructure/jwt/key-cache.service';


export function buildUsersController(dataSource: DataSource) {
  // 1. Infrastructure
  const userRepo = new UserRepository(
    dataSource.getRepository(UserEntity)
  );

  const passwordService = new PasswordService();
  const bcryptHasherService = new BcryptHasherService()
  const scopeService = new ScopeService()
  const jwtService = new JwtService(new KeyCacheService())

  // 2. Domain services
  const featureUserService = new FeatureUserService()
  const authService = new AuthService(jwtService, passwordService);


  // 3. Application service
  const createBulkUsersUseCase = new CreateBulkUsersUseCase(featureUserService, userRepo, bcryptHasherService, passwordService, authService, scopeService)
  const getUserUseCase = new GetUserUseCase(featureUserService, userRepo)
  const createUserUseCase = new CreateUserUseCase(userRepo, passwordService)

  // 4. Controller
  return new UsersController(
    jwtService,
    scopeService,
    createBulkUsersUseCase,
    getUserUseCase,
    createUserUseCase,
  );
}
