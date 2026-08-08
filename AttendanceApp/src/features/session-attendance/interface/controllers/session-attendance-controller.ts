import { Request, Response } from "express";
import { BaseController, IJwtService, ScopeService, Scopes } from "app-framework";
import { env } from "../../../../infrastructure/config/env";
import { CreateSessionAttendanceUseCase } from "../../application/use-cases/create-session-attendance.use-case";
import { CreateBulkSessionAttendanceUseCase } from "../../application/use-cases/create-bulk-session-attendance.use-case";
import { GetSessionAttendanceUseCase } from "../../application/use-cases/get-session-attendance.use-case";
import { GetSessionAttendancesUseCase } from "../../application/use-cases/get-session-attendances.use-case";
import { GetSessionAttendanceByOccurrenceUseCase } from "../../application/use-cases/get-session-attendance-by-occurrence.use-case";
import { GetSessionAttendanceByUserUseCase } from "../../application/use-cases/get-session-attendance-by-user.use-case";
import { UpdateSessionAttendanceUseCase } from "../../application/use-cases/update-session-attendance.use-case";
import { DeleteSessionAttendanceUseCase } from "../../application/use-cases/delete-session-attendance.use-case";

export class SessionAttendanceController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly create: CreateSessionAttendanceUseCase,
    private readonly createBulk: CreateBulkSessionAttendanceUseCase,
    private readonly get: GetSessionAttendanceUseCase,
    private readonly getAll: GetSessionAttendancesUseCase,
    private readonly getByOccurrence: GetSessionAttendanceByOccurrenceUseCase,
    private readonly getByUser: GetSessionAttendanceByUserUseCase,
    private readonly update: UpdateSessionAttendanceUseCase,
    private readonly remove: DeleteSessionAttendanceUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });

    this.registerRoute("get", "/", this.list.bind(this), { authenticate: false });
    this.registerRoute("get", "/occurrence/:sessionOccurrenceId", this.listByOccurrence.bind(this), { authenticate: false });
    this.registerRoute("get", "/user/:userId", this.listByUser.bind(this), { authenticate: false });
    this.registerRoute("get", "/:id", this.getOne.bind(this), { authenticate: false });
    this.registerRoute("post", "/", this.createOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("post", "/bulk", this.createMany.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("patch", "/:id", this.updateOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
    this.registerRoute("delete", "/:id", this.deleteOne.bind(this), { authorizeScopes: [Scopes.Mudeer] });
  }
  private async list(_req: Request, res: Response): Promise<void> { res.json(await this.getAll.execute()); }
  private async listByOccurrence(req: Request, res: Response): Promise<void> { res.json(await this.getByOccurrence.execute(Number(req.params.sessionOccurrenceId))); }
  private async listByUser(req: Request, res: Response): Promise<void> { res.json(await this.getByUser.execute(Number(req.params.userId))); }
  private async getOne(req: Request, res: Response): Promise<void> { const result = await this.get.execute(Number(req.params.id)); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async createOne(req: Request, res: Response): Promise<void> { res.status(201).json(await this.create.execute(req.body)); }
  private async createMany(req: Request, res: Response): Promise<void> { res.status(201).json(await this.createBulk.execute(req.body)); }
  private async updateOne(req: Request, res: Response): Promise<void> { const result = await this.update.execute(Number(req.params.id), req.body); if (!result) { res.sendStatus(404); return; } res.json(result); }
  private async deleteOne(req: Request, res: Response): Promise<void> { await this.remove.execute(Number(req.params.id)); res.sendStatus(204); }
}
