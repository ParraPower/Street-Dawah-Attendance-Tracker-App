import { IUserRepository } from "@/features/users/domain/repositories/iuser-repository";
import { IHasherService } from "../../domains/services/hasher-service";
import { mapper } from "@/mapping/mapper";
import { RegisterUserResponseDto } from "../dtos/register-user.dto";
import { UserEntity } from "../../../users/domain/entities/user-entity";
import { ScopeService } from "../../domains/services/scope-service";

export class RegisterUserUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly hashService: IHasherService,
    private readonly scopeService: ScopeService
  ) { }

  async execute(email: string, username: string, password: string) {
    const passwordHash = await this.hashService.generate(password);
    const user = await this.repo.create({
      email,
      username,
      passwordHash,
      scopes: this.scopeService.generateDefault(), // default scopes on signup
    });
    return mapper.map(user, UserEntity, RegisterUserResponseDto);
  }

}