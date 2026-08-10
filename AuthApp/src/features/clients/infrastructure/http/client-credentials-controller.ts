import { Router } from 'express';
import { DawahRequestHandler } from '@auth/shared/infrastructure/http/dawah-request-handler';
import { Scopes } from '@auth/features/auth/domain/policies/scope-types';
import { ClientCredentialsResponseDto } from '../../application/dtos/client-credentials-response.dto';
import { CreateClientCredentialsDto } from '../../application/dtos/create-client-credentials.dto';
import { UpdateClientCredentialsDto } from '../../application/dtos/update-client-credentials.dto';
import { CreateClientCredentialsUseCase, DeleteClientCredentialsUseCase, UpdateClientCredentialsUseCase } from '../../application/use-cases';
import { ClientEntity } from '../../domains/entities/client-entity';
import { BaseController } from '@auth/shared/infrastructure/http/base-controller';
import { ScopeService } from "app-framework";
import { IAuthAppJwtService } from '@auth/features/auth/domain/services/jwt-service';
import { env } from '@auth/shared/infrastructure/config/env';

export class ClientCredentialsController extends BaseController {
  public readonly router = Router();

  constructor(
    protected readonly jwtService: IAuthAppJwtService,
    protected readonly scopeService: ScopeService,
    private readonly createUseCase: CreateClientCredentialsUseCase, 
    private readonly updateUseCase: UpdateClientCredentialsUseCase, 
    private readonly deleteUseCase: DeleteClientCredentialsUseCase) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.jwtDefaultAudience });

    this.registerRoute('post', '/', this.createCredentials.bind(this), {
      authorizeScopes: [Scopes.Khaleef],
    });

    this.registerRoute('put', '/:id', this.updateCredentials.bind(this), {
      authorizeScopes: [Scopes.Khaleef],
    });
    this.registerRoute('delete', '/:id', this.deleteCredentials.bind(this), {
      authorizeScopes: [Scopes.Khaleef],
    });
    
        // // GET all client credentials - Authenticated users only
    // this.router.get('/', authenticate, this.getAllCredentials.bind(this));

    // // GET single client credentials by ID - Authenticated users only
    // this.router.get('/:id', authenticate, this.getCredentialsById.bind(this));
  }

  // private getAllCredentials: DawahRequestHandler<
  //   any,
  //   ClientCredentialsResponseDto[]
  // > = async (req, res) => {
  //   try {
  //     const clients = await this.clientService.getAllClientCredentials();
  //     const dtos = clients.map((client) => this.mapToDto(client));
  //     res.json(dtos);
  //   } catch (err: any) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };

  // private getCredentialsById: DawahRequestHandler<
  //   { id: string },
  //   ClientCredentialsResponseDto
  // > = async (req, res) => {
  //   try {
  //     const id = parseInt(req.params.id);
  //     if (isNaN(id)) {
  //       return res.status(400).json({ error: 'Invalid ID' });
  //     }

  //     const client = await this.clientService.getClientCredentials(id);
  //     if (!client) {
  //       return res.status(404).json({ error: 'Client not found' });
  //     }

  //     res.json(this.mapToDto(client));
  //   } catch (err: any) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };

  private createCredentials: DawahRequestHandler<
    any,
    { client: ClientCredentialsResponseDto; secret: string },
    CreateClientCredentialsDto
  > = async (req, res) => {
    try {
      const { name, scopes } = req.body;

      if (!name || !Array.isArray(scopes)) {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const { client, secret } = await this.createUseCase.execute(
        name,
        scopes
      );

      res.status(201).json({
        client: this.mapToDto(client),
        secret,
      });
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('already exists')) {
        return res.status(409).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  private updateCredentials: DawahRequestHandler<
    { id: string },
    ClientCredentialsResponseDto,
    UpdateClientCredentialsDto
  > = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const updates = req.body;
      const updated = await this.updateUseCase.execute(id, updates);

      if (!updated) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(this.mapToDto(updated));
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('already exists')) {
        return res.status(409).json({ error: err.message });
      }
      if (err.message.includes('not found')) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  private deleteCredentials: DawahRequestHandler<
    { id: string },
    { message: string }
  > = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const deleted = await this.deleteUseCase.execute(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json({ message: 'Client credentials deleted successfully' });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  private mapToDto(client: ClientEntity): ClientCredentialsResponseDto {
    return {
      id: client.id,
      name: client.name,
      scopes: client.scopes,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
