import { UserEntity } from "../entities/user-entity";
import { UserOnboardingFlags } from "../enums/user-onboarding-flags";
import { isNotNullOrEmtpy } from '@auth/utils/strings'
import { OnboardingEventType } from '../types/onboarding-event.type';
import { OnboardingFlagsService } from './onboarding-flags.service';

//src\features\users\domain\services\user-service.ts
export class UserService {
  private readonly onboardingFlagsService = new OnboardingFlagsService();

  public isUserActive(user: UserEntity): boolean {
    if (!user) return false;

    return this.hasPasswordHash(user)
      && this.hasAssignedScopes(user)
      && this.isNotDeletedUser(user)
      && (this.hasOnboardingEvent(user, OnboardingEventType.EmailVerified) || this.isImportedMember(user))
      && this.hasOnboardingEvent(user, OnboardingEventType.ProfileCreated)
      && this.hasOnboardingEvent(user, OnboardingEventType.WhatsAppOptedIn);
  }

  public hasCompletedOnboarding(user: UserEntity): boolean {
    if (!user) return false;

    const hasImportedMemberOnboarding = this.isImportedMember(user);
    const meetsEmailRequirement = this.hasOnboardingEvent(user, OnboardingEventType.EmailVerified) || hasImportedMemberOnboarding;

    if (hasImportedMemberOnboarding) {
      return this.hasOnboardingEvent(user, OnboardingEventType.ProfileCreated)
        && this.hasOnboardingEvent(user, OnboardingEventType.WhatsAppOptedIn)
        && meetsEmailRequirement
        && this.hasAssignedScopes(user);
    }

    return this.hasOnboardingFlag(user, UserOnboardingFlags.SetInitialPassword)
      && this.hasOnboardingEvent(user, OnboardingEventType.ProfileCreated)
      && this.hasOnboardingEvent(user, OnboardingEventType.WhatsAppOptedIn)
      && this.hasOnboardingEvent(user, OnboardingEventType.EmailVerified)
      && this.hasAssignedScopes(user);
  }

  public getMissingOnboardingFlags(user: UserEntity): UserOnboardingFlags[] {
    if (!user) return [];

    const isImportedMember = this.isImportedMember(user);
    const requiredFlags = [
      UserOnboardingFlags.SetInitialPassword,
      UserOnboardingFlags.ProfileCreated,
      UserOnboardingFlags.WhatsAppOptedIn,
      UserOnboardingFlags.EmailVerified,
    ];

    return requiredFlags.filter((flag) => {
      if (isImportedMember && (flag === UserOnboardingFlags.SetInitialPassword || flag === UserOnboardingFlags.EmailVerified)) {
        return false;
      }

      return !this.hasOnboardingFlag(user, flag);
    });
  }

  public getActivationStatus(user: UserEntity): {
    isActive: boolean;
    hasCompletedOnboarding: boolean;
    missingFlags: UserOnboardingFlags[];
  } {
    return {
      isActive: this.isUserActive(user),
      hasCompletedOnboarding: this.hasCompletedOnboarding(user),
      missingFlags: this.getMissingOnboardingFlags(user),
    };
  }

  public isNotDeletedUser(user: UserEntity): boolean {
    return !!user && user.isDeleted !== true;
  }

  private hasPasswordHash(user: UserEntity): boolean {
    return isNotNullOrEmtpy(user.passwordHash);
  }

  private hasAssignedScopes(user: UserEntity): boolean {
    return Array.isArray(user.scopes) && user.scopes.length > 0;
  }

  private hasOnboardingEvent(user: UserEntity, event: OnboardingEventType): boolean {
    const flag = this.onboardingFlagsService.getFlagForEvent(event);
    return this.hasOnboardingFlag(user, flag);
  }

  public hasOnboardingFlag(user: UserEntity, flag: UserOnboardingFlags): boolean {
    const flags = BigInt(user?.onboardingFlags ?? 0n);
    return (flags & BigInt(flag)) === BigInt(flag);
  }

  public isImportedMember(user: UserEntity): boolean {
    return this.hasOnboardingFlag(user, UserOnboardingFlags.ImportedMember);
  }
}