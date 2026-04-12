import { UserDto } from "../../../users/application/dtos/user.dto"

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
