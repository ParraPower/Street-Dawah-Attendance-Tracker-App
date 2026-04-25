import bcrypt from 'bcrypt';
import crypto from 'crypto'
import _ from 'lodash'
import { isNotNullOrEmtpy } from '@auth/utils/strings';


export class PasswordService {
  private readonly TEMP_PASSWORD_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  private readonly MINIMUM_PASSWORD_LENGTH = 8
  private readonly TEMP_PASSWORD_LENGTH = this.MINIMUM_PASSWORD_LENGTH


  isValidPassword = (pwd: string | undefined | null): boolean => 
    isNotNullOrEmtpy(pwd) && _.trim(pwd!).length >= this.MINIMUM_PASSWORD_LENGTH && /^[A-Za-z0-9]{1,}$/.test(pwd!);
  

  generateTempPassword = (): string => {
    const bytes = crypto.randomBytes(this.TEMP_PASSWORD_LENGTH);
    let result = "";

    for (let i = 0; i < this.TEMP_PASSWORD_LENGTH; i++) {
      result += this.TEMP_PASSWORD_CHARS[bytes[i] % this.TEMP_PASSWORD_CHARS.length];
    }

    return result;
  }

  generatePasswordHash = async (password: string): Promise<string> =>
    await bcrypt.hash(password, 12)
}