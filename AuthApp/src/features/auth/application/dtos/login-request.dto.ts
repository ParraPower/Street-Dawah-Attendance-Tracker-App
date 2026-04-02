export interface LoginRequestDto {
  email: string;
  password: string;
  grant_type: "password";
}
