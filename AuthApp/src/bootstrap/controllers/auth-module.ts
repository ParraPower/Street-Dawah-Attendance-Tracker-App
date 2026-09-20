// app.ts (or modules/auth/auth.module.ts)
import { DataSource } from "typeorm";
import { ClientEntity } from "@auth/features/clients/domains/entities/client-entity";
import { BcryptHasherService } from "@auth/shared/infrastructure/password/bcrypt-hasher-service";
import { ClientRepository } from "@auth/features/clients/infrastructure/persistence/typeorm/client-repo";
import { ClientService } from "@auth/features/clients/domains/services/client-service";
import { GenerateTokenUseCase, IssueClientCredentialsTokenUseCase, LoginUserUseCase, RegisterUserUseCase, ResetUserPasswordUseCase } from "@auth/features/auth/application/use-cases/index";
// import { JwtService } from "../infrastructure/crypto/jwt.service";
// import { TokenFactory } from "../domain/tokens/token.factory";
import { AuthService } from "@auth/features/auth/domain/services/auth-service";
import { AuthController } from "@auth/features/auth/infrastructure/http/auth-controller";
import { UserRepository } from "@auth/features/users/infrastructure/persistence/typeorm/user-repository";
import { UserEntity } from "@auth/features/users/domain/entities/user-entity";
import { UserService } from "@auth/features/users/domain/services/user-service";
import { GetUserActivationStatusUseCase } from '@auth/features/users/application/use-cases/get-user-activation-status.use-case';
import { PasswordService } from "@auth/features/auth/domain/services/password-service";
import { ScopeService } from "app-framework"
import { AuthAppJwtService } from "@auth/shared/infrastructure/auth/jwt-service";
import { KeyCacheService } from "@auth/features/auth/infrastructure/jwt/key-cache.service";
import { RefreshAccessTokenUseCase } from "@auth/features/auth/application/use-cases/refresh-access-token.usecase";
import { HandleOnboardingEventUseCase } from "@auth/features/users/application/use-cases/handle-onboarding-event.use-case";
import { SendEmailVerificationCodeUseCase } from "@auth/features/auth/application/use-cases/send-email-verification-code.usecase";
import { VerifyEmailVerificationCodeUseCase } from "@auth/features/auth/application/use-cases/verify-email-verification-code.usecase";
import { EmailVerificationRepository } from "@auth/features/auth/infrastructure/persistence/typeorm/email-verification-repository";
import { EmailVerificationEntity } from "@auth/features/auth/domain/entities/email-verification-entity";
import { SmtpEmailService } from "@auth/shared/infrastructure/email/smtp-email-service";

//src\bootstrap\controllers\auth-module.ts
export function buildAuthController(dataSource: DataSource) {
  // 1. Infrastructure
  const clientRepo = new ClientRepository(
    dataSource.getRepository(ClientEntity)
  );
  const userRepo = new UserRepository(
    dataSource.getRepository(UserEntity)
  );

  const emailVerificationRepo =
  new EmailVerificationRepository(
    dataSource.getRepository(
      EmailVerificationEntity,
    ),
  );
  //const jwt = new JwtService(process.env.JWT_SECRET!);

  const bcryptHasher = new BcryptHasherService();
  const scopeService = new ScopeService();

  const userService = new UserService();
  const getUserActivationStatusUseCase = new GetUserActivationStatusUseCase(userService, userRepo);

  const jwtService = new AuthAppJwtService(new KeyCacheService());

  // 2. Domain services
const emailService =
  new SmtpEmailService();
  const passwordService = new PasswordService();
  const clientService = new ClientService(bcryptHasher);
  const authService = new AuthService(jwtService, passwordService);
  //const tokenFactory = new TokenFactory(jwt);

  // 3. Application service

  // 4. Controller
  const issueClientCredentialsTokenUseCase = new IssueClientCredentialsTokenUseCase(jwtService, clientRepo, clientService);
  const loginUserUseCase = new LoginUserUseCase(userRepo, bcryptHasher, authService, userService, getUserActivationStatusUseCase);
  const generateTokenUserCase = new GenerateTokenUseCase(issueClientCredentialsTokenUseCase, loginUserUseCase);
  const registerUserUseCase = new RegisterUserUseCase(userRepo, bcryptHasher, scopeService);
  const resetUserPasswordUseCase = new ResetUserPasswordUseCase(userRepo, passwordService, bcryptHasher)
  const refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(jwtService, authService, userRepo, userService, getUserActivationStatusUseCase);
const handleOnboardingEventUseCase =
  new HandleOnboardingEventUseCase(
    userRepo,
  );

  const sendEmailVerificationCodeUseCase =
  new SendEmailVerificationCodeUseCase(
    userRepo,
    emailVerificationRepo,
    bcryptHasher,
    emailService,
    userService
  );

  const verifyEmailVerificationCodeUseCase =
  new VerifyEmailVerificationCodeUseCase(
    userRepo,
    emailVerificationRepo,
    handleOnboardingEventUseCase,
    bcryptHasher,
  );

return new AuthController(
  jwtService,
  scopeService,
  generateTokenUserCase,
  registerUserUseCase,
  resetUserPasswordUseCase,
  refreshAccessTokenUseCase,
  sendEmailVerificationCodeUseCase,
  verifyEmailVerificationCodeUseCase,
);
}
