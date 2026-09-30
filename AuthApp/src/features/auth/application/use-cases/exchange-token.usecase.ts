import { UnauthorizedError } from '@auth/shared/infrastructure/middleware/global-error-handler';
import { IUserRepository } from '@auth/features/users/domain/repositories/iuser-repository';
import { UserService } from '@auth/features/users/domain/services/user-service';
import { IAuthAppJwtService } from '@auth/features/auth/domain/services/jwt-service';
import { IssueTokenUseCase } from './issue-token.usecase';
import { env } from '@auth/shared/infrastructure/config/env';

export interface ExchangeTokenResponse {
  accessToken: string;
  accessTokenExpiresIn: string;
}

export class ExchangeTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
    private readonly issueTokenUseCase: IssueTokenUseCase,
    private readonly jwtService: IAuthAppJwtService,
  ) {}

  async execute(accessToken: string): Promise<ExchangeTokenResponse> {
    if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
      throw new UnauthorizedError('Invalid access token');
    }

    let decoded: unknown;
    try {
      decoded = this.jwtService.verifyJwtSync(accessToken);
    } catch {
      throw new UnauthorizedError('Invalid access token');
    }

    if (!decoded || typeof decoded !== 'object') {
      throw new UnauthorizedError('Invalid access token');
    }

    const payload = decoded as Record<string, unknown>;
    const hasExpectedAudience = Array.isArray(payload.aud)
      ? payload.aud.includes(env.jwtDefaultAudience)
      : payload.aud === env.jwtDefaultAudience;
    const subject = payload.sub;

    if (
      payload.type !== 'access' ||
      payload.iss !== env.jwtIssuer ||
      !hasExpectedAudience ||
      typeof subject !== 'string' ||
      !/^[1-9]\d*$/.test(subject)
    ) {
      throw new UnauthorizedError('Invalid access token');
    }

    const userId = Number(subject);
    if (!Number.isSafeInteger(userId)) {
      throw new UnauthorizedError('Invalid access token');
    }

    const user = await this.userRepository.findById(userId);
    if (!user || !this.userService.isNotDeletedUser(user)) {
      throw new UnauthorizedError('Invalid access token');
    }

    const isImportedRegistrationToken =
      payload.imported === true && this.userService.isImportedMember(user);
    if (payload.is_logged_in_user !== true && !isImportedRegistrationToken) {
      throw new UnauthorizedError('Invalid access token');
    }

    const signed = this.issueTokenUseCase.execute({
      user,
      tokenType: 'access',
      profile: 'user',
    });

    return {
      accessToken: signed.token,
      accessTokenExpiresIn: signed.expiresIn,
    };
  }
}