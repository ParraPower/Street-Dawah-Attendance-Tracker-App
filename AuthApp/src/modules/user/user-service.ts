
import AppDataSource from '@/data/data-source';
import { UserEntity } from "@/features/users/domain/entities/user-entity";
import { mapper } from "@/mapping/mapper";
import { Repository } from "typeorm/repository/Repository";
import _ from 'lodash'
import { PasswordService } from "@/features/auth/domains/services/password-service";
import crypto from 'crypto'
import { CreateUserDto } from '@/features/users/application/dtos/create-user.dto';
import { UserDto } from '@/features/users/application/dtos/user.dto';

export class UserService {
  private userRepo: Repository<UserEntity>;
  private passwordService: PasswordService
  
  constructor() {
    this.userRepo = AppDataSource.getRepository(UserEntity);
    this.passwordService = new PasswordService
  }

  private generateTempPasswordForCreateUser = (createUser: CreateUserDto): CreateUserDto => {

   const temp = _.trim(createUser.password);
    const needsGeneratedPassword =
      _.isEmpty(temp) || !this.passwordService.isValidPassword(temp);

    if (needsGeneratedPassword) {
      createUser.password = this.passwordService.generateTempPassword();
    }

    return createUser;
  }

  createUser = async (user: CreateUserDto): Promise<UserDto> => {
    this.generateTempPasswordForCreateUser(user)

    const entity = mapper.map(user, Object.getPrototypeOf(user).constructor, UserEntity)
    const passwordHash = await this.passwordService.generatePasswordHash(user.password!)
    entity.passwordHash = passwordHash
    entity.temporaryPasswordGuid = crypto.randomUUID()
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