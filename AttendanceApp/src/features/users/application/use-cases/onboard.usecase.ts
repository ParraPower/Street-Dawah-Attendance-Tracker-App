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

  execute = async (payload: OnboardUserDto): Promise<UserDto> => {
    if (!isNotNullOrEmpty(payload.name)) {
      throw new ValidationError("Name is required for onboarding");
    }
    if (!isNotNullOrEmpty(payload.mobile)) {
      throw new ValidationError("Mobile is required for onboarding");
    }
    if (!this.mobileService.isInternationalNumber(payload.mobile)) {
      throw new ValidationError("Invalid mobile number", { mobile: payload.mobile });
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

    // If mobile belongs to an active user, reject
    const existingByMobile = await this.repo.findByMobile(payload.mobile);
    if (existingByMobile && this.userService.isUserActive(existingByMobile)) {
      throw new ValidationError("Mobile number already in use", { mobile: payload.mobile });
    }

    // Create new user
    const entity = mapper.map(payload as unknown as CreateUserDto, CreateUserDto, UserEntity) as UserEntity;
    const created = await this.repo.create(entity);

    // Emit onboarding events to Auth API (do not modify any onboarding flags locally)
    try {
      if (payload.authUserId) {
        await this.emitOnboardingEvents(payload.authUserId, payload.whatsAppMsgOptIn);
      } else {
        console.warn(`OnboardUseCase: no authUserId provided; skipping onboarding events emission`);
      }
    } catch (err: any) {
      // Log and continue - allow retries to be implemented later
      console.error(`OnboardUseCase: failed to emit onboarding events: ${err?.message || err}`);
    }

    return mapper.map(created, UserEntity, UserDto);
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
      while (attempt < maxAttempts) {
        attempt++;
        try {
          await client.post(`/internal/users/${authUserId}/onboarding-events`, { event });
          console.log(`Emitted onboarding event ${event} for authUserId=${authUserId}`);
          break; // success
        } catch (err: any) {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message || err?.message || String(err);
          const isTransient = !status || status >= 500;
          console.error(`Failed to emit event ${event} (attempt ${attempt}): ${msg}`);
          if (!isTransient || attempt >= maxAttempts) {
            console.error(`Giving up emitting event ${event} for authUserId=${authUserId}`);
            break;
          }
          // backoff
          await sleep(200 * attempt);
        }
      }
    }
  }
}
