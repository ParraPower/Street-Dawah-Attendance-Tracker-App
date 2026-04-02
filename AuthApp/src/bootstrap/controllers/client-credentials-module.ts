import { DataSource } from 'typeorm';
import { ClientEntity } from '@/features/clients/domains/entities/client-entity';
import { ClientRepository } from '@/features/clients/infrastructure/persistence/typeorm/client-repo';
import { ClientCredentialsController } from '../../features/clients/infrastructure/http/client-credentials-controller';
import { ClientService } from '@/features/clients/domains/services/client-service';
import { BcryptHasherService } from '@/shared/infrastructure/password/bcrypt-hasher-service';
import { CreateClientCredentialsUseCase, DeleteClientCredentialsUseCase, UpdateClientCredentialsUseCase } from '@/features/clients/application/use-cases';

export function buildClientCredentialsController(dataSource: DataSource) {
  // 1. Infrastructure
  const clientRepo = new ClientRepository(
    dataSource.getRepository(ClientEntity)
  );

  const hasherService = new BcryptHasherService();

  // 2. Domain services
  const clientService = new ClientService(hasherService);

  // 3. Controller
  return new ClientCredentialsController(
    new CreateClientCredentialsUseCase(clientRepo, clientService),
    new UpdateClientCredentialsUseCase(clientRepo),
    new DeleteClientCredentialsUseCase(clientRepo),
  );
}
