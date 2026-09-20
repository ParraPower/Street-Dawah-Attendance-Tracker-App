import { MobileServiceValidateResponse } from '../types/mobile.service.types';

export interface IMobileService {
    format(val: string, resultFormat?: string): string
    validate(val: string, formatToMatch?: string): MobileServiceValidateResponse
    isAustralianNumber(val: string): boolean;
    isInternationalNumber(val: string): boolean;
    normalizeNumber(val: string): string
}