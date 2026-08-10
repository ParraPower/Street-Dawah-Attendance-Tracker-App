
import { CreateUserDto } from "../dtos/create-user.dto";
import { IUserRepository } from "../../domain/repositories/iuser-repository";
import { UserService } from "../../domain/services/user-service";
import { mapper } from "@auth/shared/infrastructure/mapping/mapper";
import { UserEntity } from "../../domain/entities/user-entity";
import { CreateBulkUsersResponseDto, CreateBulkUsersResponseOmittedUserDto } from "../dtos/create-bulk-users-response.dto";
import { ValidationError } from "@auth/shared/infrastructure/middleware/global-error-handler";

export class PreviewBulkUsersUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly repo: IUserRepository
  ) {}

  execute = async (incomingUsers: CreateUserDto[]) => {
    // 🔹 Step 1: Guard input (reuse existing validation logic)
    const { usernames } = this.guardBulkCreateUsingUsernames(incomingUsers);

    // 🔹 Step 2: Fetch existing users
    const existingUsers = await this.repo.findByUsernames(usernames);

    const omittedUsers: CreateBulkUsersResponseOmittedUserDto[] = [];
    const includedUsers: CreateUserDto[] = [];

    // 🔹 Step 3: Categorize users (reuse generator logic)
    for await (const result of this.getCategorizedUsersByUsernames(
      incomingUsers,
      existingUsers
    )) {
      if (result.type === "omitted") {
        omittedUsers.push(
          result.user as CreateBulkUsersResponseOmittedUserDto
        );
      } else {
        includedUsers.push(result.user as CreateUserDto);
      }
    }

    // ✅ No DB writes, just return preview
    return {
      createdUsers: [], // → nothing created in preview
      omittedUsers,
      includedUsers // ✅ optional but useful for client clarity
    } as unknown as CreateBulkUsersResponseDto;
  };

  // ✅ Reuse (copy or extract later into shared logic)
  guardBulkCreateUsingUsernames = (users: CreateUserDto[]) => {
    let usernames = users.map(x => x.username);

    if (usernames.filter(x => !x)?.length > 0)
      throw new ValidationError("Invalid users were attempted to be inserted", {
        invalidUsers: users.filter(x => !x.username),
      });

    return { usernames };
  };

  async *getCategorizedUsersByUsernames(
    incomingUsers: CreateUserDto[],
    existingUsers: UserEntity[]
  ) {
    const activeUsers = existingUsers.filter(x =>
      this.userService.isUserActive(x)
    );

    const usernameMap = new Map(
      activeUsers.map(u => [u.username.toLowerCase(), u])
    );

    for (const user of incomingUsers) {
      const existing = usernameMap.get(user.username.toLowerCase());

      if (existing) {
        yield {
          type: "omitted",
          user: mapper.map(
            existing,
            UserEntity,
            CreateBulkUsersResponseOmittedUserDto
          ),
        };
      } else {
        yield {
          type: "included",
          user,
        };
      }
    }
  }
}
