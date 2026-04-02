export interface IHasherService {
  generateHashWithSize(password: string, size: number): Promise<string>;
  generateHash(password: string): Promise<string>;
  verify(raw: string, hash: string): Promise<boolean>;
}
