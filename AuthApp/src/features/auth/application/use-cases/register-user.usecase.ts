import { IUserRepository } from "@/features/users/domain/repositories/iuser-repository";
import { IHasherService } from "../../domains/services/hasher-service";
import { mapper } from "@/mapping/mapper";
import { RegisterUserResponseDto } from "../dtos/register-user.dto";

export class RegisterUserUseCase {
  constructor(
    private readonly repo: IUserRepository,
    private readonly hashService: IHasherService,
  ) { }

  async execute(email: string, username: string, password: string) {
    const passwordHash = await this.hashService.generateHashWithSize(password, 12);
    const user = this.repo.create({
      email,
      username,
      passwordHash,
      scopes: [], // default scopes on signup
    });
    return mapper.map(user, Object.getPrototypeOf(user).constructor, RegisterUserResponseDto);
  }

}