export type MobileServiceValidateResponse = {
    isValid: boolean;
    formatMatchedAgainst: string;
    wasFormatProvided: boolean;
    hadTrailingSpace: string;
    isAustralianNumber: boolean;
}