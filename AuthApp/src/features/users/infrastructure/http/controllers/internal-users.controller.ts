import { Router } from 'express';
import { BaseController } from '@auth/shared/infrastructure/http/base-controller';
import { DawahRequestHandler } from '@auth/shared/infrastructure/http/dawah-request-handler';
import { Scopes } from '@auth/features/auth/domain/policies/scope-types';
import { HandleOnboardingEventUseCase } from '../../../application/use-cases/handle-onboarding-event.use-case';
import { env } from '@auth/shared/infrastructure/config/env';
import { OnboardingEventType } from '../../../domain/types/onboarding-event.type';

export class InternalUsersController extends BaseController {
  public readonly router = Router();

  constructor(
    protected readonly jwtService: any,
    protected readonly scopeService: any,
    private readonly handleOnboardingEventUseCase: HandleOnboardingEventUseCase,
  ) {
    super(jwtService, scopeService, { jwtDefaultAudience: env.jwtDefaultAudience });

    this.registerRoute('post', '/:userId/onboarding-events', this.handleOnboardingEvent, {
      authenticate: true,
      authorizeScopes: [Scopes.Khaleef],
    });
  }

  public handleOnboardingEvent: DawahRequestHandler<
    { userId: string },
    void,
    { event: keyof typeof OnboardingEventType }
  > = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (Number.isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const body = req.body as { event?: string };
    if (!body || typeof body.event !== 'string') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const eventKey = body.event as keyof typeof OnboardingEventType;
    // Ensure event maps to a valid enum key
    const eventValue = (OnboardingEventType as any)[eventKey];
    if (typeof eventValue === 'undefined') {
      return res.status(400).json({ message: 'Invalid event' });
    }

    await this.handleOnboardingEventUseCase.execute({ userId, event: eventValue });
    res.status(204).send();
  }
}
