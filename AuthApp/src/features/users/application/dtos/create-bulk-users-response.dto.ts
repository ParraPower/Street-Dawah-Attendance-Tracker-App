import { UserDto } from "./user.dto";
import { ScopeList } from "app-framework";

export class CreateBulkUsersResponseOmittedUserDto {
  id!: string;
  username!: string;
  email?: string;
  scopes!: ScopeList;
  createdAt!: Date;
}

export class CreateBulkUsersResponseDto {
  createdUsers!: UserDto[]
  omittedUsers!: CreateBulkUsersResponseOmittedUserDto[]
}