// app.ts (or modules/auth/auth.module.ts)
import { DataSource } from "typeorm";
import { ClientEntity } from "@/domains/clients/client-entity";
import { ClientRepository } from "@/data/clients/client-repo";
import { PasswordService } from "@/domains/password/password-service";
import { ClientService } from "@/domains/clients/client-service";
// import { JwtService } from "../infrastructure/crypto/jwt.service";
// import { TokenFactory } from "../domain/tokens/token.factory";
import { AuthService } from "@/modules/auth/auth-service";
import { AuthController } from "@/modules/auth/auth-controller";

export function buildAuthController(dataSource: DataSource) {
  // 1. Infrastructure
  const clientRepo = new ClientRepository(
    dataSource.getRepository(ClientEntity)
  );
  const passwordService = new PasswordService();
  //const jwt = new JwtService(process.env.JWT_SECRET!);

  // 2. Domain services
  const clientService = new ClientService(clientRepo, passwordService);
  //const tokenFactory = new TokenFactory(jwt);

  // 3. Application service
  const authService = new AuthService(passwordService,clientService);

  // 4. Controller
  return new AuthController(authService);
}
