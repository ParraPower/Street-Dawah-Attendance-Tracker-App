import { Request, Response } from "express";
import { BaseController, IJwtService, RequestWithUser, ScopeService, Scopes } from "app-framework";
import { CreateSessionOccurrenceUseCase } from "../../application/use-cases/create-session-occurrence.use-case";
import { CreateBulkSessionOccurrencesUseCase } from "../../application/use-cases/create-bulk-session-occurrences.use-case";
import { GetSessionOccurrenceUseCase } from "../../application/use-cases/get-session-occurrence.use-case";
import { GetSessionOccurrencesUseCase } from "../../application/use-cases/get-session-occurrences.use-case";
import { GetCurrentWeekSessionOccurrencesUseCase } from "../../application/use-cases/get-current-week-session-occurrences.use-case";
import { UpdateSessionOccurrenceUseCase } from "../../application/use-cases/update-session-occurrence.use-case";
import { DeleteSessionOccurrenceUseCase } from "../../application/use-cases/delete-session-occurrence.use-case";
import { CreateThisWeeksSessionOccurrencesUseCase } from "../../application/use-cases/create-this-weeks-session-occurrences.use-case";
import { SessionOccurrenceActor } from "../../application/authorization/session-occurrence-authorization.service";
import { env } from "../../../../infrastructure/config/env";

export class SessionOccurrenceController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateSessionOccurrenceUseCase,
    private readonly createBulk: CreateBulkSessionOccurrencesUseCase,
    private readonly createThisWeeks: CreateThisWeeksSessionOccurrencesUseCase,
    private readonly get: GetSessionOccurrenceUseCase,
    private readonly getAll: GetSessionOccurrencesUseCase,
    private readonly getCurrentWeek: GetCurrentWeekSessionOccurrencesUseCase,
    private readonly update: UpdateSessionOccurrenceUseCase,
    private readonly remove: DeleteSessionOccurrenceUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });

    this.registerRoute("get", "/", this.list.bind(this));
    this.registerRoute("get", "/current-week", this.listCurrentWeek.bind(this), { authenticate: true });
    this.registerRoute("get", "/:id", this.getOne.bind(this));
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("post", "/bulk", this.createMany.bind(this), { authorizeScopes: [Scopes.Mudeer, Scopes.Khaleef] });
    this.registerRoute("post", "/create-this-weeks", this.createThisWeeksOccurrences.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Emir] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }
  private async list(req: RequestWithUser, res: Response): Promise<void> {
    res.json(await this.getAll.execute(this.toActor(req)));
  }
  private async listCurrentWeek(req: RequestWithUser, res: Response): Promise<void> {
    res.json(await this.getCurrentWeek.execute(this.toActor(req)));
  }
  private async getOne(req: RequestWithUser, res: Response): Promise<void> {
    const result = await this.get.execute(Number(req.params.id), this.toActor(req));
    if (!result) { res.sendStatus(404); return; }
    res.json(result);
  }
  private toActor(req: RequestWithUser): SessionOccurrenceActor {
    return { scopes: req.user ? this.scopeService.parseScopeStringFromJWT(req.user) : [] };
  }
  private async createOne(req: RequestWithUser, res: Response): Promise<void> {
    res.status(201).json(await this.create.execute(req.body, this.toActor(req)));
  }
  private async createMany(req: RequestWithUser, res: Response): Promise<void> {
    res.status(201).json(await this.createBulk.execute(req.body, this.toActor(req)));
  }
  private async createThisWeeksOccurrences(req: RequestWithUser, res: Response): Promise<void> {
    res.status(201).json(await this.createThisWeeks.execute(this.toActor(req)));
  }
  private async updateOne(req: RequestWithUser, res: Response): Promise<void> {
    const result = await this.update.execute(Number(req.params.id), req.body, this.toActor(req));
    if (!result) { res.sendStatus(404); return; }
    res.json(result);
  }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}