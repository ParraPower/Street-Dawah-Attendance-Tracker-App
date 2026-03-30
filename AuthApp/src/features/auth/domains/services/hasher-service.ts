export interface IHasherService {
  /**
   * Hashes a password using bcrypt (cost 12).
   */
  generateHash(password: string): Promise<string>;
  verify(raw: string, hash: string): Promise<boolean>;
}
