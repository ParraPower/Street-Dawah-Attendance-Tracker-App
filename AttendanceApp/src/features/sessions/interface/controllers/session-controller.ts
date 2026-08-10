import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { CreateSessionUseCase } from "../../application/use-cases/create-session.use-case";
import { GetSessionUseCase } from "../../application/use-cases/get-session.use-case";
import { GetSessionsUseCase } from "../../application/use-cases/get-sessions.use-case";
import { UpdateSessionUseCase } from "../../application/use-cases/update-session.use-case";
import { DeleteSessionUseCase } from "../../application/use-cases/delete-session.use-case";
import { env } from "../../../../infrastructure/config/env";

export class SessionController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateSessionUseCase,
    private readonly get: GetSessionUseCase,
    private readonly getAll: GetSessionsUseCase,
    private readonly update: UpdateSessionUseCase,
    private readonly remove: DeleteSessionUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });

    this.registerRoute("get", "/", this.list.bind(this), { authenticate: false });
    this.registerRoute("get", "/:id", this.getOne.bind(this), { authenticate: false });
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }
  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async getOne(req: Request, res: Response): Promise<void> { const result = await this.get.execute(Number(req.params.id)); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async createOne(req: Request, res: Response): Promise<void> { res.status(201).json(await this.create.execute(req.body)); }
  private async updateOne(req: Request, res: Response): Promise<void> { const result = await this.update.execute(Number(req.params.id), req.body); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}
