import { IMobileService } from "../interfaces/mobile.service";
import { MobileServiceValidateResponse } from "../types/mobile.service.types";

export class MobileService implements IMobileService {

	private defaultFormats: string[];

	constructor(defaultFormats: string[] = []) {
		this.defaultFormats = defaultFormats;
	}

	normalizeNumber(val: string): string {
		if (!val) return '';

		// Trim and remove leading apostrophes
		let trimmed = val.trim().replace(/^'+/, '');

		// Preserve leading plus
		const hadPlus = trimmed.startsWith('+');

		// Extract digits only (but keep plus if present)
		const digitsOnly = hadPlus
			? '+' + trimmed.replace(/\D/g, '').replace(/^\+/, '')
			: trimmed.replace(/\D/g, '');

		// --- AUSTRALIAN MOBILE DETECTION ---
		const isPlus61 = digitsOnly.startsWith('+61');
		const is61 = digitsOnly.startsWith('61');
		const is04 = digitsOnly.startsWith('04');

		// Australian mobile numbers always start with "4" after country code
		const australianMobile =
			(isPlus61 && digitsOnly.substring(3, 4) === '4') ||
			(is61 && digitsOnly.substring(2, 3) === '4') ||
			(is04 && digitsOnly.substring(1, 2) === '4');

		if (australianMobile) {
			// Normalize to +614xxxxxxxx
			if (isPlus61) {
				return `+61${digitsOnly.substring(3)}`;
			}
			if (is61) {
				return `+61${digitsOnly.substring(2)}`;
			}
			if (is04) {
				return `+61${digitsOnly.substring(1)}`;
			}
		}

		// --- NON-AUSTRALIAN INTERNATIONAL NUMBERS ---
		// If already has +, return cleaned version
		if (hadPlus) {
			return `+${digitsOnly.replace(/\D/g, '')}`;
		}

		// Otherwise add + in front
		return `+${digitsOnly}`;
	}

	isE164Compliant(val: string): boolean {
		if (!val) return false;
		const trimmed = val.trim();
		// E.164 format: +[country code][subscriber number including area code]
		return /^\+\d{1,15}$/.test(trimmed);
	}

	isInternationalNumber(val: string): boolean {
		if (!val) return false;

		const trimmed = val.trim();

		if (trimmed.startsWith("0")) return false; // Local numbers starting with 0 are not international

		if (!trimmed.startsWith("+")) return false; // International numbers must start with a plus sign

		return this.isE164Compliant(trimmed);
	}

	// -----------------------------
	//  AUSTRALIAN NUMBER CHECK
	// -----------------------------
	isAustralianNumber(val: string): boolean {
		if (!val) return false;

		const trimmed = val.trim();

		// Case 1: Local Australian mobile format
		if (trimmed.startsWith("04")) {
			const digitsOnly = trimmed.replace(/[\s-]/g, "");
			return /^\d{10}$/.test(digitsOnly);
		}

		// Case 2: International Australian mobile format +614xxxxxxxx
		if (trimmed.startsWith("+614")) {
			const digitsOnly = trimmed.replace(/[\s-]/g, "");
			return /^\+614\d{8}$/.test(digitsOnly);
		}

		return false;

	}

	// -----------------------------
	//  FORMAT METHOD
	// -----------------------------
	format(val: string, resultFormat?: string): string {
		if (!val) return "";

		const trimmed = val.trim();
		const digitsOnly = trimmed.replace(/[\s-]/g, "");

		if (resultFormat) {
			return this.applyFormat(digitsOnly, resultFormat);
		}

		if (this.isAustralianNumber(trimmed)) {
			return `+61${digitsOnly.substring(1)}`;
		}

		return `+${digitsOnly}`;
	}

	private applyFormat(digits: string, format: string): string {
		let output = "";
		let digitIndex = 0;

		for (const ch of format) {
			if (ch === "x") {
				output += digits[digitIndex++] ?? "";
			} else {
				output += ch;
			}
		}

		return output;
	}

	// -----------------------------
	//  VALIDATION METHOD
	// -----------------------------
	validate(val: string, formatToMatch?: string): MobileServiceValidateResponse {
		const original = val;
		const trimmed = val.trim();
		const hadTrailingSpace = original.endsWith(" ") ? "yes" : "no";

		if (!/\d$/.test(trimmed)) {
			return this.invalidResponse(formatToMatch, hadTrailingSpace);
		}

		const hasSpaces = trimmed.includes(" ");
		const hasDashes = trimmed.includes("-");

		if (hasSpaces && hasDashes) {
			return this.invalidResponse(formatToMatch, hadTrailingSpace);
		}

		// 1. Strict format match if provided
		if (formatToMatch) {
			const regex = this.formatToRegex(formatToMatch);
			const isMatch = regex.test(trimmed);

			return {
				isValid: isMatch,
				formatMatchedAgainst: formatToMatch,
				wasFormatProvided: true,
				hadTrailingSpace,
				isAustralianNumber: this.isAustralianNumber(trimmed)
			};
		}

		// 2. Try defaultFormats if supplied
		for (const fmt of this.defaultFormats) {
			const regex = this.formatToRegex(fmt);
			if (regex.test(trimmed)) {
				return {
					isValid: true,
					formatMatchedAgainst: fmt,
					wasFormatProvided: false,
					hadTrailingSpace,
					isAustralianNumber: this.isAustralianNumber(trimmed)
				};
			}
		}

		// 3. Fallback to fallback rules
		const isValidDefault = this.validateFallbackRules(trimmed);

		return {
			isValid: isValidDefault,
			formatMatchedAgainst: "default",
			wasFormatProvided: false,
			hadTrailingSpace,
			isAustralianNumber: this.isAustralianNumber(trimmed)
		};
	}

	private invalidResponse(formatToMatch: string | undefined, hadTrailingSpace: string): MobileServiceValidateResponse {
		return {
			isValid: false,
			formatMatchedAgainst: formatToMatch ?? "",
			wasFormatProvided: !!formatToMatch,
			hadTrailingSpace,
			isAustralianNumber: false
		};
	}

	private validateFallbackRules(val: string): boolean {
		if (!(val.startsWith("0") || val.startsWith("+"))) return false;

		const digitsOnly = val.replace(/[\s-]/g, "");

		// 1. Reject Australian landlines (local format)
		if (digitsOnly.startsWith("02") ||
			digitsOnly.startsWith("03") ||
			digitsOnly.startsWith("07") ||
			digitsOnly.startsWith("08")) {
			return false;
		}

		// 2. Reject Australian landlines (international format)
		if (digitsOnly.startsWith("+612") ||
			digitsOnly.startsWith("+613") ||
			digitsOnly.startsWith("+617") ||
			digitsOnly.startsWith("+618")) {
			return false;
		}

		// 3. Accept Australian mobile numbers (local or international)
		if (this.isAustralianNumber(val)) {
			return true;
		}

		// 4. Accept other international numbers (not +61)
		if (digitsOnly.startsWith("+")) {
			if (digitsOnly.startsWith("+61")) {
				// +61 but not +614 → invalid
				return false;
			}
			return /^\+\d+$/.test(digitsOnly);
		}

		// 5. Accept other local numbers starting with 0 (non-landline)
		if (digitsOnly.startsWith("0")) {
			return /^\d+$/.test(digitsOnly);
		}

		return false;
	}

	private formatToRegex(format: string): RegExp {
		let regexStr = "^";

		for (const ch of format) {
			if (ch === "x") regexStr += "\\d";
			else if (ch === " ") regexStr += "\\s";
			else if (ch === "-") regexStr += "-";
			else if (ch === "+") regexStr += "\\+"
			else regexStr += ch;
		}

		regexStr += "$";
		return new RegExp(regexStr);
	}
}
