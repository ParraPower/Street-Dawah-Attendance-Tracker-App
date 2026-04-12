export interface IHasherService {
  generateWithSize(password: string, size: number): Promise<string>;
  generate(password: string): Promise<string>;
  verify(raw: string, hash: string): Promise<boolean>;
}
