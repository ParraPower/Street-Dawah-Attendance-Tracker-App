// src/domains/user/dtos/CreateUserDto.ts
import { IsEmail, IsString, IsOptional, IsPhoneNumber, MinLength, IsEnum } from "class-validator";
import { MembershipTypeEnum } from "../../../features/memberships/domain/enums/membership-type-enum";

export class RegisterUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber(undefined)
  mobile!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsEnum(MembershipTypeEnum)
  membershipType?: MembershipTypeEnum
}
