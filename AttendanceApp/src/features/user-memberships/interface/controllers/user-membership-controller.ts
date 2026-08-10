import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { env } from "../../../../infrastructure/config/env";
import { CreateUserMembershipUseCase } from "../../application/use-cases/create-user-membership.use-case";
import { CreateBulkUserMembershipsUseCase } from "../../application/use-cases/create-bulk-user-memberships.use-case";
import { GetUserMembershipUseCase } from "../../application/use-cases/get-user-membership.use-case";
import { GetUserMembershipsUseCase } from "../../application/use-cases/get-user-memberships.use-case";
import { GetMembershipsByUserUseCase } from "../../application/use-cases/get-memberships-by-user.use-case";
import { GetUsersByMembershipUseCase } from "../../application/use-cases/get-users-by-membership.use-case";
import { UpdateUserMembershipUseCase } from "../../application/use-cases/update-user-membership.use-case";
import { DeleteUserMembershipUseCase } from "../../application/use-cases/delete-user-membership.use-case";

export class UserMembershipController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateUserMembershipUseCase,
    private readonly createBulk: CreateBulkUserMembershipsUseCase,
    private readonly get: GetUserMembershipUseCase,
    private readonly getAll: GetUserMembershipsUseCase,
    private readonly getByUser: GetMembershipsByUserUseCase,
    private readonly getByMembership: GetUsersByMembershipUseCase,
    private readonly update: UpdateUserMembershipUseCase,
    private readonly remove: DeleteUserMembershipUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });

    this.registerRoute("get", "/", this.list.bind(this), { authenticate: false });
    this.registerRoute("get", "/user/:userId", this.listByUser.bind(this), { authenticate: false });
    this.registerRoute("get", "/membership/:membershipId", this.listByMembership.bind(this), { authenticate: false });
    this.registerRoute("get", "/:id", this.getOne.bind(this), { authenticate: false });
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("post", "/bulk", this.createMany.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }

  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async listByUser(req: Request, res: Response): Promise<void> { res.json(await this.getByUser.execute(Number(req.params.userId))); }
  private async listByMembership(req: Request, res: Response): Promise<void> { res.json(await this.getByMembership.execute(Number(req.params.membershipId))); }
  private async getOne(req: Request, res: Response): Promise<void> { const result = await this.get.execute(Number(req.params.id)); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async createOne(req: Request, res: Response): Promise<void> { res.status(201).json(await this.create.execute(req.body)); }
  private async createMany(req: Request, res: Response): Promise<void> { res.status(201).json(await this.createBulk.execute(req.body)); }
  private async updateOne(req: Request, res: Response): Promise<void> { const result = await this.update.execute(Number(req.params.id), req.body); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}
