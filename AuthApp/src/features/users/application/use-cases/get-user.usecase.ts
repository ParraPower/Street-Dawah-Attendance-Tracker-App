import { mapper } from "@/shared/infrastructure/mapping/mapper";
import { IUserRepository } from "../../domain/repositories/iuser-repository";
import { UserService } from "../../domain/services/user-service";
import { UserDto } from "../dtos/user.dto";
import { UserEntity } from "../../domain/entities/user-entity";
import { NotFoundError } from "@/shared/infrastructure/middleware/global-error-handler";

export class GetUserUseCase {
  constructor(private readonly userService: UserService,
    private readonly repo: IUserRepository,
  ) {}

  async execute(userId: number): Promise<UserDto | null> {
    const user = await this.repo.findById(userId) // Ensure user exists and is active before fetching

    if (!user || !this.userService.isUserActive(user)) {
      throw new NotFoundError('User not found or inactive');
    }

    return mapper.map(user, UserEntity, UserDto) as UserDto;
  }
}
