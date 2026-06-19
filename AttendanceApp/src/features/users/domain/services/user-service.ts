import { UserEntity } from "../entities/user-entity";
import { isNotNullOrEmpty } from "app-framework";

export class UserService {
  constructor() {}

  public isUserActive = (user: UserEntity): boolean => {
    return user && isNotNullOrEmpty(user.mobile) && !user.isDeleted;
  };

  public normalizePhone = (mobileNumber: string): string => {
    if (!mobileNumber) return '';

    // Trim and remove leading apostrophes
    let trimmed = mobileNumber.trim();
    trimmed = trimmed.replace(/^'+/, '');

    // Preserve whether the original had a leading plus
    const hadPlus = trimmed.startsWith('+');

    // Strip everything except digits
    const digitsOnly = trimmed.replace(/\D/g, '');

    // If original started with a plus, re-add it and return (preserve international form)
    if (hadPlus) return `+${digitsOnly}`;

    // Otherwise return digits only. For Australian mobiles starting with 04 there should be no plus.
    return digitsOnly;
  };
}
