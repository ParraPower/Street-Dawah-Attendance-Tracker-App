export interface IPasswordService {
  isValidPassword(pwd: string | undefined | null): boolean
  generateTempPassword(): string
  generatePasswordHash(password: string): Promise<string>
}