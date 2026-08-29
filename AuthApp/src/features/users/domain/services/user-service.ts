import { UserEntity } from "../entities/user-entity";
import { isNotNullOrEmtpy } from '@auth/utils/strings'

export class UserService {
  constructor() {

  }

  public isUserActive = (user: UserEntity) => user && isNotNullOrEmtpy(user.passwordHash) && user.scopes?.length > 0 && this.isNotDeletedUser(user)
  public isNotDeletedUser = (user: UserEntity) => user && user.isDeleted !== true
}