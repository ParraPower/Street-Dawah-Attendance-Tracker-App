import bcrypt from 'bcrypt';
import AppDataSource from '@/data/data-source';
import { UserEntity } from '@/domains/users/user-entity';
import { signToken } from '../../security/jwt';
import { PasswordService } from '@/domains/password/password-service';
import { ClientCredentialsDto } from './dto/client-credentials.dto';
import { ClientService } from '@/domains/clients/client-service';
import { mapper } from '@/mapping/mapper';
import { UserDto } from '@/dtos/user/user.dto';
import { createUserProfile } from '@/mapping/profiles/user-profile';
import { RegisterUserResponseDto } from './dto/register-user.dto';
import { ScopeList, Scopes } from './scopes';
//import { TokenWhitelist } from '../../domains/tokens/token-whitelist-entity';
//import { env } from '../../config/env';

export class AuthService {
  private userRepo = AppDataSource.getRepository(UserEntity);
  //private tokenWhitelistRepo = AppDataSource.getRepository(TokenWhitelist);

  constructor(private readonly passwordService: PasswordService, private readonly clientService: ClientService,) {
    createUserProfile();
  }

  async register(email: string, username: string, password: string) : Promise<RegisterUserResponseDto> {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({
      email,
      username,
      passwordHash,
      scopes: [], // default scopes on signup
    });
    const savedUser = await this.userRepo.save(user);
    return mapper.map(savedUser, Object.getPrototypeOf(savedUser).constructor, RegisterUserResponseDto);
  }

  async login(email: string, password: string) {
    let user: UserEntity | null = new UserEntity();
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_FAKE_LOGIN === 'true') {
      Object.assign(user, {
        id: 'some-uuid',
        email: email,
        username: 'testuser',
        passwordHash: await bcrypt.hash('password123', 12),
        scopes: ['user-read', 'user-write'],
        createdAt: new Date(),
        updatedAt: new Date(), 
      });
    }
    else {
      user = await this.userRepo.findOne({ where: { email } });
    }
    if (!user) throw new Error('Invalid credentials');

    const ok = await this.passwordService.comparePasswordToUserPasswordHash(password, user);
    if (!ok) throw new Error('Invalid credentials');

    const access = signToken(user.id.toString(), user.scopes, 'access');
    const refresh = signToken(user.id.toString(), user.scopes, 'refresh');

    const userDto = mapper.map(user, Object.getPrototypeOf(user).constructor, UserDto);

    // const refreshEntity = this.tokenWhitelistRepo.create({
    //   jti: refresh.jti,
    //   userId: user.id,
    //   active: true,
    //   expiresAt: new Date(Date.now() + parseDuration(env.refreshTokenTtl)),
    // });
    // await this.tokenWhitelistRepo.save(refreshEntity);

    return {
      accessToken: access.token,
      accessTokenExpiresIn: access.expiresIn,
      refreshToken: refresh.token,
      refreshTokenExpiresIn: refresh.expiresIn,
      user: userDto,
    };
  }

  private async issueClientCredentialsToken(clientId: string, clientSecret: string) {
    // Implement client authentication logic here, e.g. check clientId and clientSecret against the database
    // For demonstration, we'll just check against hardcoded values
    const client = await this.clientService.validateClientCredentials(clientId, clientSecret); 
    if (client) {
      const token = signToken(clientId, client.scopes, 'access');
      return token;
    }
    return null;
  }

  async generateTokenClientCredentials(clientCredentials: ClientCredentialsDto) {
    if (clientCredentials.grant_type !== "client_credentials") {
      return null
    }

    const token = await this.issueClientCredentialsToken(
      clientCredentials.client_id,
      clientCredentials.client_secret
    );

    if (!token) {
      return null;
    }

    return {
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: 3600,
    };
  }

  // async revokeRefreshToken(jti: string) {
  //   await this.tokenWhitelistRepo.update({ jti }, { active: false });
  // }
}

