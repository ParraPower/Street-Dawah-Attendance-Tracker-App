import { validate as validateUUID } from 'uuid'
import { IUserRepository } from '../../domain/repositories/iuser-repository';
import { UserService } from '../../domain/services/user-service';
import { ValidationError } from '@auth/shared/infrastructure/middleware/global-error-handler';

export class RetrieveImportedUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(temporaryPasswordGuid: string) {
    if (!validateUUID(temporaryPasswordGuid))
      throw new ValidationError('Invalid information provided');

    const user = await this.repo.findByTemporaryPasswordGuid(temporaryPasswordGuid);
    if (!user)
      throw new ValidationError('Invalid information provided');

    if (!this.userService.isImportedMember(user))
      throw new ValidationError('Invalid information provided');

    // Only allow retrieval while still onboarding (not fully completed)
    if (this.userService.hasCompletedOnboarding(user))
      throw new ValidationError('Invalid information provided');

    return { id: user.id, username: user.username };
  }
}
