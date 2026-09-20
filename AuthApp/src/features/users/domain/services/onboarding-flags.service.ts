import { UserOnboardingFlags } from '../enums/user-onboarding-flags';
import { OnboardingEventType } from '../types/onboarding-event.type';

export class OnboardingFlagsService {
  public getFlagForEvent(event: OnboardingEventType): UserOnboardingFlags {
    switch (event) {
      case OnboardingEventType.EmailVerified:
        return UserOnboardingFlags.EmailVerified;
      case OnboardingEventType.ProfileCreated:
        return UserOnboardingFlags.ProfileCreated;
      case OnboardingEventType.MobileVerified:
        return UserOnboardingFlags.MobileVerified;
      case OnboardingEventType.WhatsAppOptedIn:
        return UserOnboardingFlags.WhatsAppOptedIn;
      case OnboardingEventType.TermsAccepted:
        return UserOnboardingFlags.TermsAccepted;
      default:
        return UserOnboardingFlags.None;
    }
  }
}
