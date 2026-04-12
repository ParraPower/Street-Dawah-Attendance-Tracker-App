import { PasswordService } from "../../../auth/domains/services/password-service";
import _ from "lodash";
import { CreateUserDto } from "../../application/dtos/create-user.dto";
import { UserEntity } from "../entities/user-entity";
import { isNotNullOrEmtpy } from '@/utils/strings'

export class UserService {
  constructor(private readonly passwordService: PasswordService) {

  }

  public generateTempPasswordForCreateUser = (createUser: CreateUserDto): CreateUserDto => {
     const temp = _.trim(createUser.password);
      const needsGeneratedPassword =
        _.isEmpty(temp) || !this.passwordService.isValidPassword(temp);
  
      if (needsGeneratedPassword) {
        createUser.password = this.passwordService.generateTempPassword();
      }
  
      return createUser;
    }

  public isUserActive = (user: UserEntity) => user && isNotNullOrEmtpy(user.passwordHash) && user.scopes?.length > 0 && !user.isDeleted
  
}