// src/domains/user/dtos/CreateUserDto.ts
import { IsEmail, IsString, IsOptional, IsPhoneNumber, MinLength, IsEnum } from "class-validator";
import { MembershipTypeEnum } from "../../../domains/membership/membership-module.js";

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
