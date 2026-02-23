import { UserDto } from "@/dtos/user/user.dto";
import AppDataSource from '@/data/data-source';
import { UserEntity } from "@/domains/users/user-entity";
import { CreateUserDto } from "@/dtos/user/create-user.dto";
import { mapper } from "@/mapping/mapper";
import { Repository } from "typeorm/repository/Repository";
import _ from 'lodash'
import { PasswordService } from "../../domains/password/password-service";
import crypto from 'crypto'

export class UserService {
  private userRepo: Repository<UserEntity>;
  private passwordService: PasswordService
  
  constructor() {
    this.userRepo = AppDataSource.getRepository(UserEntity);
    this.passwordService = new PasswordService
  }

  private generateTempPasswordForCreateUser = (createUser: CreateUserDto): CreateUserDto => {

   const temp = _.trim(createUser.tempPassword);
    const needsGeneratedPassword =
      _.isEmpty(temp) || !this.passwordService.isValidTempPassword(temp);

    if (needsGeneratedPassword) {
      createUser.tempPassword = this.passwordService.generateTempPassword();
    }

    return createUser;
  }

  createUsers = async (users: CreateUserDto[]) => {
    let result: UserDto[] = []
    // re-implement this method to use bulk insert for better performance, currently it creates users one by one which is inefficient for large batches.
    this.userRepo.manager.transaction(async transactionalEntityManager => {
      const userEntities = users.map(user => {
        const createUserDtoWithTempPassword = this.generateTempPasswordForCreateUser(user)
        const entity = mapper.map(createUserDtoWithTempPassword, Object.getPrototypeOf(createUserDtoWithTempPassword).constructor, UserEntity)
        return entity
      })
      const createdUserEntities = await transactionalEntityManager.save(userEntities) 

      result = createdUserEntities.map((entity, index) => {
        return mapper.map(entity, Object.getPrototypeOf(users[index]).constructor, UserDto)
      })
    })
    return result
  }

  resetPassword = async (temporaryPasswordGuid: string, newPassword: string): Promise<boolean> => {
    const user = await this.userRepo.findOneBy({ temporaryPaswordGuid: temporaryPasswordGuid })
    if (!user) {
      return false
    }
    const newPasswordHash = await this.passwordService.generatePasswordHash(newPassword)
    user.passwordHash = newPasswordHash
    user.temporaryPaswordGuid = null
    await this.userRepo.save(user)
    return true
  }

  createUser = async (user: CreateUserDto): Promise<UserDto> => {
    this.generateTempPasswordForCreateUser(user)

    const entity = mapper.map(user, Object.getPrototypeOf(user).constructor, UserEntity)
    const passwordHash = await this.passwordService.generatePasswordHash(user.tempPassword!)
    entity.passwordHash = passwordHash
    entity.temporaryPaswordGuid = crypto.randomUUID()
    const createdUser = await this.userRepo.create(entity)
    const savedUser = await this.userRepo.save(createdUser)

    return mapper.map(savedUser, Object.getPrototypeOf(savedUser).constructor, UserDto)
  }

  getUserById = async (id: number): Promise<UserDto | null> => {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) return null
    return mapper.map(user, Object.getPrototypeOf(user).constructor, UserDto)
  }
}