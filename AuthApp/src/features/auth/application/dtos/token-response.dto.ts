import { UserDto } from "@/dtos/user/user.dto";

export class TokenResponseDto {
  accessToken!: string;
  accessTokenExpiresIn!: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: string;
}

export class UserTokenResponseDto {
  accessToken!: string;
  accessTokenExpiresIn!: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: string;
  user!: UserDto;
}
