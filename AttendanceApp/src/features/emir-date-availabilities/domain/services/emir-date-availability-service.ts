export class EmirDateAvailabilityService {
  validateUserId(userId: number): number {
    if (!Number.isInteger(userId) || userId <= 0) throw new Error("userId must be a positive integer");
    return userId;
  }

  normalizeDate(value: Date | string): Date {
    const dateText = value instanceof Date
      ? value.toISOString().slice(0, 10)
      : String(value).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) throw new Error("availabilityDate must be in YYYY-MM-DD format");
    const date = new Date(`${dateText}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateText) throw new Error("availabilityDate is invalid");
    return date;
  }

  validateActive(active: boolean): boolean {
    if (typeof active !== "boolean") throw new Error("active must be a boolean");
    return active;
  }
}
