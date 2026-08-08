import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { CreateLocationUseCase } from "../../../application/use-cases/create-location.use-case";
import { CreateBulkLocationsUseCase } from "../../../application/use-cases/create-bulk-locations.use-case";
import { GetLocationUseCase } from "../../../application/use-cases/get-location.use-case";
import { GetLocationsUseCase } from "../../../application/use-cases/get-locations.use-case";
import { UpdateLocationUseCase } from "../../../application/use-cases/update-location.use-case";
import { DeleteLocationUseCase } from "../../../application/use-cases/delete-location.use-case";
import { env } from "../../../../../infrastructure/config/env";

export class LocationsController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateLocationUseCase,
    private readonly createBulk: CreateBulkLocationsUseCase,
    private readonly get: GetLocationUseCase,
    private readonly getAll: GetLocationsUseCase,
    private readonly update: UpdateLocationUseCase,
    private readonly remove: DeleteLocationUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });

    this.registerRoute("get", "/", this.list.bind(this), { authenticate: false });
    this.registerRoute("get", "/:id", this.getOne.bind(this), { authenticate: false });
    this.registerRoute("post", "/bulk", this.bulkCreate.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }
  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async getOne(req: Request, res: Response): Promise<void> { const result = await this.get.execute(Number(req.params.id)); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async createOne(req: Request, res: Response): Promise<void> { res.status(201).json(await this.create.execute(req.body)); }
  private async bulkCreate(req: Request, res: Response): Promise<void> { res.status(201).json(await this.createBulk.execute(req.body)); }
  private async updateOne(req: Request, res: Response): Promise<void> { const result = await this.update.execute(Number(req.params.id), req.body); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}