export class DawahDayService {
  validateDayOfWeek(dayOfWeek: number): number {
    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error("dayOfWeek must be an integer from 0 (Sunday) to 6 (Saturday)");
    }
    return dayOfWeek;
  }

  normalizeName(name: string): string {
    return name.trim();
  }
}
