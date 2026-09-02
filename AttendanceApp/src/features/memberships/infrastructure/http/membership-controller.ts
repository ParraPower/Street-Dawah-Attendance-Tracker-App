import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { env } from "../../../../infrastructure/config/env";
import { CreateMembershipUseCase } from "../../application/use-cases/create-membership.use-case";
import { CreateBulkMembershipsUseCase } from "../../application/use-cases/create-bulk-memberships.use-case";
import { GetMembershipUseCase } from "../../application/use-cases/get-membership.use-case";
import { GetMembershipsUseCase } from "../../application/use-cases/get-memberships.use-case";
import { UpdateMembershipUseCase } from "../../application/use-cases/update-membership.use-case";
import { DeleteMembershipUseCase } from "../../application/use-cases/delete-membership.use-case";

export class MembershipController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateMembershipUseCase,
    private readonly createBulk: CreateBulkMembershipsUseCase,
    private readonly get: GetMembershipUseCase,
    private readonly getAll: GetMembershipsUseCase,
    private readonly update: UpdateMembershipUseCase,
    private readonly remove: DeleteMembershipUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });
    this.registerRoute("get", "/", this.list.bind(this), { authenticate: false });
    this.registerRoute("get", "/:id", this.getOne.bind(this), { authenticate: false });
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("post", "/bulk", this.createMany.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }
  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async getOne(req: Request, res: Response): Promise<void> { const result = await this.get.execute(Number(req.params.id)); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async createOne(req: Request, res: Response): Promise<void> { res.status(201).json(await this.create.execute(req.body)); }
  private async createMany(req: Request, res: Response): Promise<void> { res.status(201).json(await this.createBulk.execute(req.body)); }
  private async updateOne(req: Request, res: Response): Promise<void> { const result = await this.update.execute(Number(req.params.id), req.body); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}
