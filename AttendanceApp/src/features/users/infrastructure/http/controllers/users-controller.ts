import { Request, Response } from "express";
import { BaseController, IJwtService, RequestWithUser, ScopeService } from "app-framework";
import { OnboardUseCase } from "../../../application/use-cases/onboard.usecase";
import { env } from "../../../../../infrastructure/config/env";
import { OnboardUserDto } from "@attendance/features/users/application/dtos/onboard-user.dto";

export class UsersController extends BaseController {
  constructor(
    protected readonly scopeService: ScopeService,
    private readonly onboardUseCase: OnboardUseCase,
    protected readonly jwtService: IJwtService,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.authApiJwtAudience });

    this.registerRoute("post", "/onboard", this.onboard.bind(this), { authenticate: true });
  }

  private async onboard(req: RequestWithUser, res: Response): Promise<void> {
    const onboardUser = {...req.body, authUserId: req.user?.sub } as OnboardUserDto
    const result = await this.onboardUseCase.execute(onboardUser);
    res.status(201).json(result);
  }
}
