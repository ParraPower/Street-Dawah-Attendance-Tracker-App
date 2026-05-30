export interface LoginRequestDto {
  email?: string | null;
  username: string;
  password: string;
  grant_type: "password";
}
