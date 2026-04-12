import { Router } from "express";
import { authenticate, authorize } from "@/modules/auth/auth-middleware";
import { Scopes } from "@/modules/auth/scopes";
import { UserService } from "../../../../modules/user/user-service";
import { CreateUserDto } from "@/features/users/application/dtos/create-user.dto";
import { CreateBulkUsersUseCase } from "../../application/use-cases/create-bulk-users.usecase";
import { DawahRequestHandler } from "@/core/requests/dawah-request-handler";
import { UserDto } from "../../application/dtos/user.dto";
import { asyncHandler } from "@/shared/infrastructure/middleware/async-handler";
import { CreateBulkUsersResponseDto } from "../../application/dtos/create-bulk-users-response.dto";

export class UsersController {
  public readonly router = Router();

  constructor(
    private readonly createBulkUsersUseCase: CreateBulkUsersUseCase,
    private readonly userService: UserService) {
    this.router.post(
      '/',
      authenticate,
      authorize([Scopes.Emir, Scopes.Mudeer, Scopes.Khaleef]), 
      this.create.bind(this)
    );
    this.router.post(
      '/bulk',
      authenticate,
      authorize([Scopes.Emir, Scopes.Mudeer, Scopes.Khaleef]),
      asyncHandler(this.createBulk.bind(this))
    );
    this.router.get(
      '/:id',
      authenticate,
      authorize([Scopes.Mudeer, Scopes.Khaleef]),
       this.get.bind(this)
    ); 
  }
  
  public create: DawahRequestHandler<
    any,
    UserDto,
    CreateUserDto
  > = async (req, res) => {
    try {
      const requestBody = req.body as CreateUserDto;
      const user = await this.userService.createUser(requestBody);
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
    boolean
  > = async (req, res) => {
    const user = await this.userService.getUserById(parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }
}