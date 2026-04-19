import { mapper } from "@/shared/infrastructure/mapping/mapper";
import { IUserRepository } from "../../domain/repositories/iuser-repository";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserDto } from "../dtos/user.dto";
import { UserEntity } from "../../domain/entities/user-entity";
import { PasswordService } from "@/features/auth/domain/services/password-service";

export class CreateUserUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserDto> {
    const entity = mapper.map(createUserDto, CreateUserDto, UserEntity) as UserEntity;
    const passwordHash = await this.passwordService.generatePasswordHash(createUserDto.password!)
    entity.passwordHash = passwordHash
    entity.temporaryPasswordGuid = crypto.randomUUID()
    const createdUser = await this.repo.create(entity)
    return mapper.map(createdUser, UserEntity, UserDto) as UserDto;
  }
}
