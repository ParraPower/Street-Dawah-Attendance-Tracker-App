import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { env } from "../../../../infrastructure/config/env";
import { CreateEmirSessionPreferenceUseCase } from "../../application/use-cases/create-emir-session-preference.use-case";
import { DeleteEmirSessionPreferenceUseCase } from "../../application/use-cases/delete-emir-session-preference.use-case";
import { GetEmirSessionPreferenceUseCase } from "../../application/use-cases/get-emir-session-preference.use-case";
import { GetEmirSessionPreferencesUseCase } from "../../application/use-cases/get-emir-session-preferences.use-case";
import { GetEmirSessionPreferencesByUserUseCase } from "../../application/use-cases/get-emir-session-preferences-by-user.use-case";
import { GetEmirSessionPreferencesBySessionUseCase } from "../../application/use-cases/get-emir-session-preferences-by-session.use-case";
import { UpdateEmirSessionPreferenceUseCase } from "../../application/use-cases/update-emir-session-preference.use-case";

export class EmirSessionPreferenceController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateEmirSessionPreferenceUseCase,
    private readonly get: GetEmirSessionPreferenceUseCase,
    private readonly getAll: GetEmirSessionPreferencesUseCase,
    private readonly getByUser: GetEmirSessionPreferencesByUserUseCase,
    private readonly getBySession: GetEmirSessionPreferencesBySessionUseCase,
    private readonly update: UpdateEmirSessionPreferenceUseCase,
    private readonly remove: DeleteEmirSessionPreferenceUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });
    const access = { authorizeScopes: [Scopes.Emir] };
    this.registerRoute("get", "/", this.list.bind(this), access);
    this.registerRoute("get", "/user/:userId", this.listByUser.bind(this), access);
    this.registerRoute("get", "/session/:sessionId", this.listBySession.bind(this), access);
    this.registerRoute("get", "/:id", this.getOne.bind(this), access);
    this.registerRoute("post", "/", this.createOne.bind(this), access);
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), access);
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), access);
  }

  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async listByUser(req: Request, res: Response): Promise<void> { res.json(await this.getByUser.execute(Number(req.params.userId))); }
  private async listBySession(req: Request, res: Response): Promise<void> { res.json(await this.getBySession.execute(Number(req.params.sessionId))); }
  private async getOne(req: Request, res: Response): Promise<void> {
    const result = await this.get.execute(Number(req.params.id));
    if (!result) { res.sendStatus(404); return; }
    res.json(result);
  }
  private async createOne(req: Request, res: Response): Promise<void> { res.status(201).json(await this.create.execute(req.body)); }
  private async updateOne(req: Request, res: Response): Promise<void> {
    const result = await this.update.execute(Number(req.params.id), req.body);
    if (!result) { res.sendStatus(404); return; }
    res.json(result);
  }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}
