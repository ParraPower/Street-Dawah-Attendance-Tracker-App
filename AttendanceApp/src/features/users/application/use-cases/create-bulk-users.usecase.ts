import { CreateUserDto } from "../dtos/create-user.dto";
import { IUserRepository } from "../../domain/repositories/iuser-repository";
import { UserService } from "../../domain/services/user-service";
import { mapper } from "@attendance/infrastructure/mapping/mapper";
import { UserEntity } from "../../domain/entities/user-entity";
import { UserDto } from "../dtos/user.dto";
import { ValidationError } from "app-framework";
import { CreateBulkUsersResponseDto } from "../dtos/create-bulk-users-response.dto";
import { isNotNullOrEmpty } from "app-framework";

export class CreateBulkUsersUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly repo: IUserRepository
  ) {}

  execute = async (users: CreateUserDto[]): Promise<CreateBulkUsersResponseDto> => {
    let result: UserDto[] = [];

    // Extract mobile numbers for validation and lookup
    const mobiles = users.map((x) => x.mobile);

    // Validate all mobile numbers are not empty
    if (mobiles.filter((x) => !isNotNullOrEmpty(x))?.length > 0) {
      throw new ValidationError("Invalid users where attempted to be inserted", {
        invalidUsers: users.filter((x) => !isNotNullOrEmpty(x.mobile)),
      });
    }

    // Ensure mobile numbers are unique within the incoming bulk
    const mobileCounts = mobiles.reduce((acc, m) => {
      const key = String(m);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicateMobiles = Object.keys(mobileCounts).filter((k) => mobileCounts[k] > 1);
    if (duplicateMobiles.length > 0) {
      const duplicateUsers = users.filter((u) => duplicateMobiles.includes(String(u.mobile)));
      throw new ValidationError("Duplicate mobile numbers found in bulk insert", {
        duplicateMobiles,
        duplicateUsers,
      });
    }

    // Check for existing users with same mobile
    const existingUsers = await Promise.all(
      mobiles.map((mobile) => this.repo.findByMobile(mobile))
    );

    const existingUsersFlat = existingUsers.filter((u) => u !== null) as UserEntity[];
    const activeUsers = existingUsersFlat.filter((x) => this.userService.isUserActive(x));
    const activeMobiles = activeUsers.map((x) => x.mobile);

    // Filter out users with already existing active users
    const omittedUsersInBulkInsert = users.filter((x) =>
      activeMobiles.includes(x.mobile)
    );
    const includedUsersFromBulkInsert = users.filter(
      (x) => !activeMobiles.includes(x.mobile)
    );

    // Create entities from DTO
    const userEntitiesCreate = includedUsersFromBulkInsert.map((user) => {
      const entity = mapper.map(user, CreateUserDto, UserEntity) as UserEntity;
      return entity;
    });

    console.log(
      `Creating ${userEntitiesCreate.length} users. Omitted ${omittedUsersInBulkInsert.length} users due to existing active users with same mobile.`
    );

    // Save users using bulk create
    const userEntitiesResponse = await this.repo.createBulk(userEntitiesCreate);

    // Map response entities to UserDto
    result = userEntitiesResponse.map((entity) => {
      return mapper.map(entity, UserEntity, UserDto);
    });

    return {
      createdUsers: result,
      omittedUsers: omittedUsersInBulkInsert,
    } as CreateBulkUsersResponseDto;
  };
}
