import { CreateUserDto } from "../dtos/create-user.dto"
import { IUserRepository } from "../../domain/repositories/iuser-repository"
import { UserService } from "../../domain/services/user-service"
import { mapper } from "@auth/shared/infrastructure/mapping/mapper"
import { UserEntity } from "../../domain/entities/user-entity"
import { UserDto } from "../dtos/user.dto"
import { IHasherService } from "../../../auth/domain/services/hasher-service"
import { PasswordService } from "../../../auth/domain/services/password-service"
import { isNotNullOrEmtpy } from "@auth/utils/strings"
import { v4 as UUID } from 'uuid';
import { ValidationError } from "@auth/shared/infrastructure/middleware/global-error-handler"
import { CreateBulkUsersResponseDto } from "../dtos/create-bulk-users-response.dto"
import { ScopeService } from "app-framework";
import { AuthService } from "@auth/features/auth/domain/services/auth-service"

export class CreateBulkUsersUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly repo: IUserRepository,
    private readonly hasherService: IHasherService,
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService,
    private readonly scopeService: ScopeService
  ) { }
  execute = async (users: CreateUserDto[]) => {
    let result: UserDto[] = []
    
    let usernames = users.map(x => x.username)
    let emails = users.map(x => x.email)
    
    if (usernames.filter(x => !isNotNullOrEmtpy(x))?.length > 0 || emails.filter(x => !isNotNullOrEmtpy(x)).length > 0)
      throw new ValidationError('Invalid users where attempted to be inserted', {
        invalidUsers: users.filter(x => !isNotNullOrEmtpy(x.username) || !isNotNullOrEmtpy(x.email)),
    })

    const existingUsers = await this.repo.findByUsernamesAndEmails(usernames, emails)
    const activeUsers = existingUsers.filter(x => this.userService.isUserActive(x))
    const activeUsersEmails = activeUsers.map(x => x.email)
    const activeUsersUsernames = activeUsers.map(x => x.username.toLocaleLowerCase())

    const omittedUsersInBulkInsert = users.filter(x => activeUsersUsernames.includes(x.username.toLowerCase()) || activeUsersEmails.includes(x.email))
    const includedUsersFromBulkInsert = users.filter(x => !activeUsersUsernames.includes(x.username.toLowerCase()) && !activeUsersEmails.includes(x.email))

    const userEntitiesCreate = await Promise.all(includedUsersFromBulkInsert.map(async user => {  
      const initialPassword = user.password  
      const tempPassword = this.authService.generateTempPassword(initialPassword)
      user.password = tempPassword
      const entity = mapper.map(user, CreateUserDto, UserEntity) as UserEntity
      if (this.passwordService.isValidPassword(initialPassword))
        entity.passwordHash = await this.hasherService.generate(user.password!)
      else
        entity.temporaryPasswordGuid = UUID()
      entity.scopes = entity.scopes.map(x => this.scopeService.normalizeString(x))
      return entity
    }))

    const userEntitiesResponse = await this.repo.createBulk(userEntitiesCreate)

    userEntitiesResponse.map((entity, index) => {
      return mapper.map(entity, UserEntity, UserDto)
    })
    
    return {
      createdUsers: result,
      omittedUsers: omittedUsersInBulkInsert
    } as CreateBulkUsersResponseDto
  }
}