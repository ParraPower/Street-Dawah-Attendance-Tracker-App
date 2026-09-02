export class SessionOccurrenceService {
  validateSessionId(sessionId: number): number {
    if (!Number.isInteger(sessionId) || sessionId <= 0) throw new Error("A valid sessionId is required");
    return sessionId;
  }

  validateCount(value: number | null | undefined, fieldName: string): void {
    if (value === undefined || value === null) return;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      throw new Error(`${fieldName} must be a non-negative integer`);
    }
  }

  validateShowPublicly(value: boolean | null | undefined): void {
    if (value !== undefined && value !== null && typeof value !== "boolean") {
      throw new Error("showPublicly must be a boolean or null");
    }
  }

  validateMainEmirUserId(value: number | null | undefined): void {
    if (value !== undefined && value !== null && (!Number.isInteger(value) || value <= 0)) {
      throw new Error("mainEmirUserId must be a positive integer or null");
    }
  }

  normalizeDate(date: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("occurrenceDate must use YYYY-MM-DD format");
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error("Invalid occurrenceDate");
    return date;
  }
}