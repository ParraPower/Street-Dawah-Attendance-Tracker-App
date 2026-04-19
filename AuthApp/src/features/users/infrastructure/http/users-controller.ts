import { Router } from "express";
import { Scopes } from "@/features/auth/domain/policies/scope-types";
import { CreateUserDto } from "@/features/users/application/dtos/create-user.dto";
import { CreateBulkUsersUseCase } from "../../application/use-cases/create-bulk-users.usecase";
import { GetUserUseCase } from "../../application/use-cases/get-user.usecase";
import { CreateUserUseCase } from "../../application/use-cases/create-user.usecase";
import { DawahRequestHandler } from "@/shared/infrastructure/http/dawah-request-handler";
import { UserDto } from "../../application/dtos/user.dto";
import { CreateBulkUsersResponseDto } from "../../application/dtos/create-bulk-users-response.dto";
import { BaseController } from "@/shared/infrastructure/http/base-controller";
import { ScopeService } from "@/features/auth/domain/services/scope-service";
import { IAuthAppJwtService } from "@/features/auth/domain/services/jwt-service";
import { env } from "@/shared/infrastructure/config/env";

export class UsersController extends BaseController {
  public readonly router = Router();

  constructor(
    protected readonly jwtService: IAuthAppJwtService,
    protected readonly scopeService: ScopeService,
    private readonly createBulkUsersUseCase: CreateBulkUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase) {
    
    super(jwtService, scopeService, { jwtDefaultAudience: env.jwtDefaultAudience });

    this.registerRoute('post', '/', this.create, {
      authenticate: true,
      authorizeScopes: [Scopes.Emir, Scopes.Mudeer, Scopes.Khaleef],
    });

    this.registerRoute('post', '/bulk', this.createBulk, {
      authenticate: true,
      authorizeScopes: [Scopes.Emir, Scopes.Mudeer, Scopes.Khaleef],
    });

    this.registerRoute('get', '/:id', this.get, {
      authenticate: true,
      authorizeScopes: [Scopes.Mudeer, Scopes.Khaleef],
    });
  }
  
  public create: DawahRequestHandler<
    any,
    UserDto,
    CreateUserDto
  > = async (req, res) => {
    try {
      const requestBody = req.body as CreateUserDto;
      const user = await this.createUserUseCase.execute(requestBody);
      res.json(user);
    }
    catch (err: any) {

    }
  }

  public createBulk: DawahRequestHandler<
    any,
    CreateBulkUsersResponseDto,
    CreateUserDto[]
  > = async (req, res) => {
    const users = req.body as CreateUserDto[];
    const result = await this.createBulkUsersUseCase.execute(users);
    res.json(result);
  }

  public get: DawahRequestHandler<
    { id: string },
    UserDto
  > = async (req, res) => {
    const user = await this.getUserUseCase.execute(parseInt(req.params.id));
    res.json(user);
  }
}