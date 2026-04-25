import { IUserRepository } from "@auth/features/users/domain/repositories/iuser-repository";
import { IHasherService } from "../../domain/services/hasher-service";
import { ValidationError } from "@auth/shared/infrastructure/middleware/global-error-handler";
import { PasswordService } from "../../domain/services/password-service";
import { validate as validateUUID } from 'uuid'

export class ResetUserPasswordUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly hashService: IHasherService,
  ) { }

  async execute(temporaryPasswordGuid: string, newPassword: string) {
    if (!validateUUID(temporaryPasswordGuid))
      throw new ValidationError('Invalid information provided')

    const user = await this.repo.findByTemporaryPasswordGuid(temporaryPasswordGuid);
    if (!user)
      throw new ValidationError('Invalid information provided')
    
    console.log('newPassword:', newPassword)

    if (!this.passwordService.isValidPassword(newPassword))
      throw new ValidationError('Invalid password')

    user.passwordHash = await this.hashService.generate(newPassword);
    user.temporaryPasswordGuid = null;

    await this.repo.update(user.id, user)

    return { sucess: true }
  }

}