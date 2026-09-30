import { OnboardUserDto } from "../dtos/onboard-user.dto";
import { IUserRepository } from "../../domain/repositories/iuser-repository";
import { UserService } from "../../domain/services/user-service";
import { mapper } from "@attendance/infrastructure/mapping/mapper";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserEntity } from "../../domain/entities/user-entity";
import { UserDto } from "../dtos/user.dto";
import { ValidationError } from "app-framework";
import { isNotNullOrEmpty, IMobileService } from "app-framework";
import { IApiClientProvider } from "../../../../infrastructure/api";

export class OnboardUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly repo: IUserRepository,
    private readonly mobileService: IMobileService,
    private readonly apiClientProvider: IApiClientProvider
  ) {}

  execute = async (
    payload: OnboardUserDto,
    accessToken: string,
  ): Promise<UserDto & { accessToken: string; accessTokenExpiresIn: string }> => {
    if (!accessToken.trim()) {
      throw new ValidationError("A user access token is required for onboarding");
    }
    if (!Number.isInteger(payload.authUserId) || payload.authUserId <= 0) {
      throw new ValidationError("A valid auth user ID is required for onboarding");
    }
    if (!isNotNullOrEmpty(payload.name)) {
      throw new ValidationError("Name is required for onboarding");
    }
    if (!isNotNullOrEmpty(payload.mobile)) {
      throw new ValidationError("Mobile is required for onboarding");
    }

    if (!this.mobileService.validate(payload.mobile)) {
      throw new ValidationError("Invalid mobile number", { mobile: payload.mobile });
    }
    
    let mobile = payload.mobile
    if (!this.mobileService.isInternationalNumber(payload.mobile)) {
      mobile = this.mobileService.normalizeNumber(mobile)
    }

    // If user already exists by auth user id, update
    // if (payload.authUserId) {
    //   const existingByAuth = await this.repo.findByAuthUserId(payload.authUserId);
    //   if (existingByAuth) {
    //     Object.assign(existingByAuth, payload);
    //     const updated = await this.repo.update(existingByAuth.id, existingByAuth);
    //     return mapper.map(updated ?? existingByAuth, UserEntity, UserDto);
    //   }
    // }

    const existingByAuthUser = await this.repo.findByAuthUserId(payload.authUserId);
    const existingByMobile = await this.repo.findByMobile(mobile);
    if (
      existingByMobile &&
      existingByMobile.id !== existingByAuthUser?.id &&
      this.userService.isUserActive(existingByMobile)
    ) {
      throw new ValidationError("Mobile number already in use", { mobile: payload.mobile });
    }

    const entity = mapper.map(payload as unknown as CreateUserDto, CreateUserDto, UserEntity) as UserEntity;
    const profile = existingByAuthUser
      ? await this.repo.update(existingByAuthUser.id, {...payload, mobile })
      : await this.repo.create(entity);

    if (!profile) {
      throw new ValidationError("Unable to save onboarding profile");
    }

    await this.emitOnboardingEvents(payload.authUserId, payload.whatsAppMsgOptIn);

    const client = this.apiClientProvider.getAuthClient();
    const { data: token } = await client.post<{
      accessToken: string;
      accessTokenExpiresIn: string;
    }>("/internal/auth/exchange-token", { accessToken });

    return {
      ...mapper.map(profile, UserEntity, UserDto),
      ...token,
    };
  };

  private async emitOnboardingEvents(authUserId: number, whatsAppOptIn?: boolean): Promise<void> {
    const client = this.apiClientProvider.getAuthClient();
    const events: string[] = ["ProfileCreated", "TermsAccepted"];
    if (whatsAppOptIn) {
      events.push("WhatsAppOptedIn");
    }

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (const event of events) {
      let attempt = 0;
      const maxAttempts = 3;
      let succeeded = false;
      let lastError: unknown;
      while (attempt < maxAttempts) {
        attempt++;
        try {
          await client.post(`/internal/users/${authUserId}/onboarding-events`, { event });
          console.log(`Emitted onboarding event ${event} for authUserId=${authUserId}`);
          succeeded = true;
          break;
        } catch (err: any) {
          lastError = err;
          const status = err?.response?.status;
          const msg = err?.response?.data?.message || err?.message || String(err);
          const isTransient = !status || status >= 500;
          console.error(`Failed to emit event ${event} (attempt ${attempt}): ${msg}`);
          if (!isTransient || attempt >= maxAttempts) {
            console.error(`Giving up emitting event ${event} for authUserId=${authUserId}`);
            break;
          }
          await sleep(200 * attempt);
        }
      }

      if (!succeeded) {
        throw lastError ?? new Error(`Failed to emit event ${event} for authUserId=${authUserId}`);
      }
    }
  }
}
