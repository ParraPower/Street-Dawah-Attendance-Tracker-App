import { UserEntity } from "../entities/user-entity";
import { isNotNullOrEmpty } from "app-framework";

export class UserService {
  constructor() {}

  public isUserActive = (user: UserEntity): boolean => {
    return user && isNotNullOrEmpty(user.mobile) && !user.isDeleted;
  };
}
