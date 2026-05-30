import { isNotNullOrEmpty } from "../../utils/strings";
import { IPasswordService } from "../interfaces/password-service";
import { ICryptographyService } from "../interfaces/cryptograpahy-service";
import { CryptoCryptographyService } from "./crypto-cryptograhpy-service";
import { IHasherService } from "../interfaces/hasher-service";
import _ from "lodash"
import { BcryptHasherService } from "./bcrypt-hasher-service";

export class PasswordService implements IPasswordService {
  private readonly crytographyService: ICryptographyService
  private readonly hashService: IHasherService
  private readonly TEMP_PASSWORD_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  private readonly MINIMUM_PASSWORD_LENGTH = 8
  private readonly TEMP_PASSWORD_LENGTH = this.MINIMUM_PASSWORD_LENGTH
  private readonly PASSWORD_HASH_LENGTH = 12

  constructor() {
    this.crytographyService = new CryptoCryptographyService()
    this.hashService = new BcryptHasherService()
  }

  isValidPassword(pwd: string | undefined | null): boolean {
    return isNotNullOrEmpty(pwd) && _.trim(pwd!).length >= this.MINIMUM_PASSWORD_LENGTH && /^[A-Za-z0-9]{1,}$/.test(pwd!);
  }
  generateTempPassword(): string {
    const bytes = this.crytographyService.generateRandomBytes(this.TEMP_PASSWORD_LENGTH);
    let result = "";

    for (let i = 0; i < this.TEMP_PASSWORD_LENGTH; i++) {
      result += this.TEMP_PASSWORD_CHARS[bytes[i] % this.TEMP_PASSWORD_CHARS.length];
    }

    return result;
  }
  async generatePasswordHash(password: string): Promise<string> {
    return await this.hashService.generateWithSize(password, this.PASSWORD_HASH_LENGTH)
  }
}