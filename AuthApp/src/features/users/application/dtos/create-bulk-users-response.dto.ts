import { CreateUserDto } from "./create-user.dto";
import { UserDto } from "./user.dto";

export class CreateBulkUsersResponseDto {
  createdUsers!: UserDto[]
  omittedUsers!: CreateUserDto[]
}