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
import { CreateBulkUsersResponseDto, CreateBulkUsersResponseOmittedUserDto } from "../dtos/create-bulk-users-response.dto"
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
  execute = async (incomingUsers: CreateUserDto[]) => {
    let result: UserDto[] = []

    const { usernames } = this.guardBulkCreateUsingUsernames(incomingUsers)

    const existingUsers = await this.repo.findByUsernames(usernames)

    const omittedUsers: CreateBulkUsersResponseOmittedUserDto[] = []
    const includedUsers: CreateUserDto[] = []

    for await (const result of this.getCategorizedUsersByUsernames(
      incomingUsers,
      existingUsers,
    )) {
      if (result.type === "omitted") {
        omittedUsers.push(result.user as CreateBulkUsersResponseOmittedUserDto)
      } else {
        includedUsers.push(result.user)
      }
    }

    const userEntitiesCreate = await Promise.all(includedUsers.map(async user => {
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

    console.log(`Creating ${userEntitiesCreate.length} users. Omitted ${omittedUsers.length} users due to existing active users with same username or email.`)

    const userEntitiesResponse = [] as UserEntity[] //await this.repo.createBulk(userEntitiesCreate)

    result = userEntitiesResponse.map((entity) => {
      return mapper.map(entity, UserEntity, UserDto)
    })

    return {
      createdUsers: result,
      omittedUsers
    } as CreateBulkUsersResponseDto
  }

  guardBulkCreateUsingUsernamesAndEmails = (users: CreateUserDto[]) => {
    let usernames = users.map(x => x.username)
    let emails = users.filter(x => isNotNullOrEmtpy(x.email)).map(x => x.email) as string[] // Filter out null or empty emails before mapping

    if (usernames.filter(x => !isNotNullOrEmtpy(x))?.length > 0 || emails.filter(x => !isNotNullOrEmtpy(x)).length > 0)
      throw new ValidationError('Invalid users where attempted to be inserted', {
        invalidUsers: users.filter(x => !isNotNullOrEmtpy(x.username) || !isNotNullOrEmtpy(x.email)),
      })

    return { usernames, emails }
  }

  guardBulkCreateUsingUsernames = (users: CreateUserDto[]) => {
    let usernames = users.map(x => x.username)

    if (usernames.filter(x => !isNotNullOrEmtpy(x))?.length > 0)
      throw new ValidationError('Invalid users where attempted to be inserted', {
        invalidUsers: users.filter(x => !isNotNullOrEmtpy(x.username)),
      })

    return { usernames }
  }

  getCategorizedUsersByUsernamesAndEmails = (incomingUsers: CreateUserDto[], existingUsers: UserEntity[]) => {
    const activeUsers = existingUsers.filter(x => this.userService.isUserActive(x))
    const activeUsersEmails = activeUsers.filter(x => isNotNullOrEmtpy(x.email)).map(x => x.email) as string[]
    const activeUsersUsernames = activeUsers.map(x => x.username.toLocaleLowerCase())

    const omittedUsers = incomingUsers.filter(x => activeUsersUsernames.includes(x.username.toLowerCase()) || (x.email && isNotNullOrEmtpy(x.email) && activeUsersEmails.includes(x.email)))
    const includedUsers = incomingUsers.filter(x => !activeUsersUsernames.includes(x.username.toLowerCase()) && (!x.email || !isNotNullOrEmtpy(x.email) || !activeUsersEmails.includes(x.email)))

    return { includedUsers, omittedUsers }
  }

  async *getCategorizedUsersByUsernames(incomingUsers: CreateUserDto[], existingUsers: UserEntity[]) {
    const activeUsers = existingUsers.filter(x => this.userService.isUserActive(x))

    const usernameMap = new Map(
      activeUsers.map(u => [u.username.toLowerCase(), u])
    )

    for (const user of incomingUsers) {
      const existing = usernameMap.get(user.username.toLowerCase())

      if (existing) {
        // ✅ OMITTED: attach ID from existing user
        yield {
          type: "omitted",
          user: mapper.map(existing, UserEntity, CreateBulkUsersResponseOmittedUserDto)
        }
      } else {
        // ✅ INCLUDED
        yield {
          type: "included",
          user
        }
      }
    }
  }
}