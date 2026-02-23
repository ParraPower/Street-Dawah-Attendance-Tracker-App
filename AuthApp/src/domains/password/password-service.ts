import { UserEntity } from '@/domains/users/user-entity';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import _ from 'lodash'

export class PasswordService {
  private readonly TEMP_PASSWORD_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  private readonly TEMP_PASSWORD_LENGTH = 8

  isValidTempPassword = (pwd: string): boolean => 
    _.trim(pwd).length === this.TEMP_PASSWORD_LENGTH && /^[A-Za-z0-9]{1,}$/.test(pwd);
  

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


  comparePasswordToUserPasswordHash = async (password: string, user: UserEntity): Promise<boolean> =>
    await bcrypt.compare(password, user.passwordHash);

  async compareSecret(secret: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(secret, hash);
  }
}