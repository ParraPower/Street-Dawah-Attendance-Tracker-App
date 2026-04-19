import { UserEntity } from "../entities/user-entity";
import { isNotNullOrEmtpy } from '@/utils/strings'

export class UserService {
  constructor() {

  }

  public isUserActive = (user: UserEntity) => user && isNotNullOrEmtpy(user.passwordHash) && user.scopes?.length > 0 && !user.isDeleted
  
}