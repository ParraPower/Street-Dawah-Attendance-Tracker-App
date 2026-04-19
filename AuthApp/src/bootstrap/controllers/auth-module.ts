// app.ts (or modules/auth/auth.module.ts)
import { DataSource } from "typeorm";
import { ClientEntity } from "@/features/clients/domains/entities/client-entity";
import { BcryptHasherService } from "@/shared/infrastructure/password/bcrypt-hasher-service";
import { ClientRepository } from "@/features/clients/infrastructure/persistence/typeorm/client-repo";
import { ClientService } from "@/features/clients/domains/services/client-service";
import { GenerateTokenUseCase, IssueClientCredentialsTokenUseCase, LoginUserUseCase, RegisterUserUseCase, ResetUserPasswordUseCase } from "@/features/auth/application/use-cases/index";
// import { JwtService } from "../infrastructure/crypto/jwt.service";
// import { TokenFactory } from "../domain/tokens/token.factory";
import { AuthService } from "@/features/auth/domain/services/auth-service";
import { AuthController } from "@/features/auth/infrastructure/http/auth-controller";
import { UserRepository } from "@/features/users/infrastructure/persistence/typeorm/user-repository";
import { UserEntity } from "@/features/users/domain/entities/user-entity";
import { UserService } from "@/features/users/domain/services/user-service";
import { PasswordService } from "@/features/auth/domain/services/password-service";
import { ScopeService } from "@/features/auth/domain/services/scope-service";
import { JwtService } from "@/shared/infrastructure/auth/jwt-service";
import { KeyCacheService } from "@/features/auth/infrastructure/jwt/key-cache.service";

export function buildAuthController(dataSource: DataSource) {
  // 1. Infrastructure
  const clientRepo = new ClientRepository(
    dataSource.getRepository(ClientEntity)
  );
  const userRepo = new UserRepository(
    dataSource.getRepository(UserEntity)
  );
  //const jwt = new JwtService(process.env.JWT_SECRET!);

  const bcryptHasher = new BcryptHasherService();
  const scopeService = new ScopeService();
  const jwtService = new JwtService(new KeyCacheService());

  // 2. Domain services
  const passwordService = new PasswordService();
  const clientService = new ClientService(bcryptHasher);
  const authService = new AuthService(jwtService, passwordService);
  const userService = new UserService();
  //const tokenFactory = new TokenFactory(jwt);

  // 3. Application service

  // 4. Controller
  const issueClientCredentialsTokenUseCase = new IssueClientCredentialsTokenUseCase(jwtService, clientRepo, clientService);
  const loginUserUseCase = new LoginUserUseCase(userRepo, bcryptHasher, authService, userService);
  const generateTokenUserCase = new GenerateTokenUseCase(issueClientCredentialsTokenUseCase, loginUserUseCase);
  const registerUserUseCase = new RegisterUserUseCase(userRepo, bcryptHasher, scopeService);
  const resetUserPasswordUseCase = new ResetUserPasswordUseCase(userRepo, passwordService, bcryptHasher)

  return new AuthController(jwtService, scopeService, generateTokenUserCase, registerUserUseCase, resetUserPasswordUseCase);
}
