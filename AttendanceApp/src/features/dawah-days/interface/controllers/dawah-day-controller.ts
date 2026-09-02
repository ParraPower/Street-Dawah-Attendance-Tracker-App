import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { env } from "../../../../infrastructure/config/env";
import { CreateDawahDayUseCase } from "../../application/use-cases/create-dawah-day.use-case";
import { DeleteDawahDayUseCase } from "../../application/use-cases/delete-dawah-day.use-case";
import { GetActiveDawahDaysUseCase } from "../../application/use-cases/get-active-dawah-days.use-case";
import { GetAvailableDawahDaysUseCase } from "../../application/use-cases/get-available-dawah-days.use-case";
import { GetDawahDayByDayOfWeekUseCase } from "../../application/use-cases/get-dawah-day-by-day-of-week.use-case";
import { GetDawahDayUseCase } from "../../application/use-cases/get-dawah-day.use-case";
import { GetDawahDaysUseCase } from "../../application/use-cases/get-dawah-days.use-case";
import { UpdateDawahDayUseCase } from "../../application/use-cases/update-dawah-day.use-case";

export class DawahDayController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateDawahDayUseCase,
    private readonly get: GetDawahDayUseCase,
    private readonly getAll: GetDawahDaysUseCase,
    private readonly getActive: GetActiveDawahDaysUseCase,
    private readonly getAvailable: GetAvailableDawahDaysUseCase,
    private readonly getByDayOfWeek: GetDawahDayByDayOfWeekUseCase,
    private readonly update: UpdateDawahDayUseCase,
    private readonly remove: DeleteDawahDayUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });
    this.registerRoute("get", "/", this.list.bind(this), { authenticate: false });
    this.registerRoute("get", "/active", this.listActive.bind(this), { authenticate: false });
    this.registerRoute("get", "/available", this.listAvailable.bind(this), { authenticate: false });
    this.registerRoute("get", "/day/:dayOfWeek", this.getByDay.bind(this), { authenticate: false });
    this.registerRoute("get", "/:id", this.getOne.bind(this), { authenticate: false });
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }

  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async listActive(_req: Request, res: Response): Promise<void> { res.json(await this.getActive.execute()); }
  private async listAvailable(_req: Request, res: Response): Promise<void> { res.json(await this.getAvailable.execute()); }
  private async getByDay(req: Request, res: Response): Promise<void> {
    const result = await this.getByDayOfWeek.execute(Number(req.params.dayOfWeek));
    if (!result) { res.sendStatus(404); return; }
    res.json(result);
  }
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
