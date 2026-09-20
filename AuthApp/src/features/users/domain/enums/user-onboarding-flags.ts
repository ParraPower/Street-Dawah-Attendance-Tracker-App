export enum UserOnboardingFlags {
    None = 0,

    EmailVerified = 1 << 0,
    ProfileCreated = 1 << 1,
    MobileVerified = 1 << 2,
    WhatsAppOptedIn = 1 << 3,
    TermsAccepted = 1 << 4,
    SetInitialPassword = 1 << 5,
    ImportedMember = 1 << 6,
}
