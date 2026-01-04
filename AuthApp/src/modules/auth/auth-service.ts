import bcrypt from 'bcrypt';
//import { AppDataSource } from '../../config/ormconfig';
import { UserEntity } from '../../domains/users/user-entity';
import { signToken } from '../../security/jwt';
import { PasswordService } from '../password/password-service';
//import { TokenWhitelist } from '../../domains/tokens/token-whitelist-entity';
//import { env } from '../../config/env';

export class AuthService {
  private passwordService: PasswordService

  // private userRepo = AppDataSource.getRepository(User);
  // private tokenWhitelistRepo = AppDataSource.getRepository(TokenWhitelist);

  constructor() {
    this.passwordService = new PasswordService
  }

  // async register(email: string, username: string, password: string) {
  //   const passwordHash = await bcrypt.hash(password, 12);
  //   const user = this.userRepo.create({
  //     email,
  //     username,
  //     passwordHash,
  //     scopes: ['user-read'], // default scopes on signup
  //   });
  //   return this.userRepo.save(user);
  // }

  async login(email: string, password: string) {
    const user = new UserEntity();
    Object.assign(user, {
      id: 'some-uuid',
      email: email,
      username: 'testuser',
      passwordHash: await bcrypt.hash('password123', 12),
      scopes: ['user-read', 'user-write'],
      createdAt: new Date(),
      updatedAt: new Date(), 
    });
    console.log('Simulated user:', user);
    //const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const ok = await this.passwordService.comparePasswordToUserPasswordHash(password, user);
    if (!ok) throw new Error('Invalid credentials');

    const access = signToken(user.id.toString(), user.scopes, 'access');
    const refresh = signToken(user.id.toString(), user.scopes, 'refresh');

    // const refreshEntity = this.tokenWhitelistRepo.create({
    //   jti: refresh.jti,
    //   userId: user.id,
    //   active: true,
    //   expiresAt: new Date(Date.now() + parseDuration(env.refreshTokenTtl)),
    // });
    // await this.tokenWhitelistRepo.save(refreshEntity);

    return { user, access, refresh };
  }

  // async revokeRefreshToken(jti: string) {
  //   await this.tokenWhitelistRepo.update({ jti }, { active: false });
  // }
}

/**
 * naive duration parser "15m" | "7d"
 */
// function parseDuration(str: string): number {
//   const match = str.match(/^(\d+)([smhd])$/);
//   if (!match) throw new Error('Invalid duration');
//   const value = Number(match[1]);
//   const unit = match[2];
//   const multiplier =
//     unit === 's' ? 1000 :
//     unit === 'm' ? 60_000 :
//     unit === 'h' ? 3_600_000 :
//     86_400_000;
//   return value * multiplier;
//}

