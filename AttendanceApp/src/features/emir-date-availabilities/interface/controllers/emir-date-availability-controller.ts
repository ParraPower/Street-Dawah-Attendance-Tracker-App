import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { env } from "../../../../infrastructure/config/env";
import { CreateEmirDateAvailabilityUseCase } from "../../application/use-cases/create-emir-date-availability.use-case";
import { DeleteEmirDateAvailabilityUseCase } from "../../application/use-cases/delete-emir-date-availability.use-case";
import { GetEmirDateAvailabilityUseCase } from "../../application/use-cases/get-emir-date-availability.use-case";
import { GetEmirDateAvailabilitiesUseCase } from "../../application/use-cases/get-emir-date-availabilities.use-case";
import { GetEmirDateAvailabilitiesByDateUseCase } from "../../application/use-cases/get-emir-date-availabilities-by-date.use-case";
import { GetEmirDateAvailabilitiesByUserUseCase } from "../../application/use-cases/get-emir-date-availabilities-by-user.use-case";
import { ToggleEmirDateAvailabilityUseCase } from "../../application/use-cases/toggle-emir-date-availability.use-case";
import { UpdateEmirDateAvailabilityUseCase } from "../../application/use-cases/update-emir-date-availability.use-case";

export class EmirDateAvailabilityController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateEmirDateAvailabilityUseCase,
    private readonly get: GetEmirDateAvailabilityUseCase,
    private readonly getAll: GetEmirDateAvailabilitiesUseCase,
    private readonly getByUser: GetEmirDateAvailabilitiesByUserUseCase,
    private readonly getByDate: GetEmirDateAvailabilitiesByDateUseCase,
    private readonly update: UpdateEmirDateAvailabilityUseCase,
    private readonly toggle: ToggleEmirDateAvailabilityUseCase,
    private readonly remove: DeleteEmirDateAvailabilityUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });
    this.registerRoute("get", "/", this.list.bind(this), { authenticate: false });
    this.registerRoute("get", "/user/:userId", this.listByUser.bind(this), { authenticate: false });
    this.registerRoute("get", "/date/:date", this.listByDate.bind(this), { authenticate: false });
    this.registerRoute("get", "/:id", this.getOne.bind(this), { authenticate: false });
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id/toggle", this.toggleOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }

  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async listByUser(req: Request, res: Response): Promise<void> { res.json(await this.getByUser.execute(Number(req.params.userId))); }
  private async listByDate(req: Request, res: Response): Promise<void> { res.json(await this.getByDate.execute(String(req.params.date))); }
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
  private async toggleOne(req: Request, res: Response): Promise<void> {
    const result = await this.toggle.execute(Number(req.params.id));
    if (!result) { res.sendStatus(404); return; }
    res.json(result);
  }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}
