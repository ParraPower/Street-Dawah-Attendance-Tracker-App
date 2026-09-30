import { DataSource } from 'typeorm';
import { ScopeService } from 'app-framework';
import { UserRepository } from '@auth/features/users/infrastructure/persistence/typeorm/user-repository';
import { UserEntity } from '@auth/features/users/domain/entities/user-entity';
import { UserService } from '@auth/features/users/domain/services/user-service';
import { ExchangeTokenUseCase } from '@auth/features/auth/application/use-cases/exchange-token.usecase';
import { IssueTokenUseCase } from '@auth/features/auth/application/use-cases/issue-token.usecase';
import { InternalAuthController } from '@auth/features/auth/infrastructure/http/controllers/internal-auth.controller';
import { AuthAppJwtService } from '@auth/shared/infrastructure/auth/jwt-service';
import { KeyCacheService } from '@auth/features/auth/infrastructure/jwt/key-cache.service';

export function buildInternalAuthController(dataSource: DataSource) {
  const userRepo = new UserRepository(dataSource.getRepository(UserEntity));
  const userService = new UserService();
  const scopeService = new ScopeService();
  const jwtService = new AuthAppJwtService(new KeyCacheService());
  const issueTokenUseCase = new IssueTokenUseCase(userService, jwtService);
  const exchangeTokenUseCase = new ExchangeTokenUseCase(userRepo, userService, issueTokenUseCase, jwtService);

  return new InternalAuthController(jwtService, scopeService, exchangeTokenUseCase);
}