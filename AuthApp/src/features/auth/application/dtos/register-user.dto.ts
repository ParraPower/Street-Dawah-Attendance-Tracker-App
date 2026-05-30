import { IsEmail, IsString, MinLength } from "class-validator";
import { UserEntity } from '@auth/features/users/domain/entities/user-entity';

// filepath: c:/Users/Ahmed/source/repos/Street-Dawah-Attendance-Tracker-App/AuthApp/src/modules/auth/dto/register-user.dto.ts
export class RegisterUserDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RegisterUserResponseDto {
  email?: string | undefined | null;
  username: string;
  registeredAt?: Date;

  constructor(user: UserEntity) {
    this.email = user.email;
    this.username = user.username;
    this.registeredAt = new Date(); // Set to current date/time to indicate registration
  }
}