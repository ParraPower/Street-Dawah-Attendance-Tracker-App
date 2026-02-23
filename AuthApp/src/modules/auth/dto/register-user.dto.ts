import { UserEntity } from '@/domains/users/user-entity';

// filepath: c:/Users/Ahmed/source/repos/Street-Dawah-Attendance-Tracker-App/AuthApp/src/modules/auth/dto/register-user.dto.ts


export class RegisterUserDto {
  email: string;
  username: string;
  registeredAt: Date;

  constructor(user: UserEntity) {
    this.email = user.email;
    this.username = user.username;
    this.registeredAt = new Date(); // Set to current date/time to indicate registration
  }
}