export class AuthResponseDto {
  accessToken!: string;
  accessTokenExpiresIn!: string;
  refreshToken?: string;
  refreshTokenExpiresIn?: string;
  user!: any; // or UserDto
}
