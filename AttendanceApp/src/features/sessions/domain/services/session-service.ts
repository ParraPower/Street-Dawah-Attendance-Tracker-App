export class SessionService {
  validateDayOfWeek(dayOfWeek: number): number {
    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error("dayOfWeek must be an integer from 0 (Sunday) to 6 (Saturday)");
    }
    return dayOfWeek;
  }

  normalizeTime(time: string): string {
    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(time);
    if (!match) throw new Error("Time must use HH:mm or HH:mm:ss format");
    const [, hours, minutes, seconds = "00"] = match;
    const hour = Number(hours);
    const minute = Number(minutes);
    const second = Number(seconds);
    if (hour > 23 || minute > 59 || second > 59) throw new Error("Invalid time");
    return `${hours}:${minutes}:${seconds}`;
  }

  validateTimeRange(startTime: string, endTime: string): void {
    if (startTime >= endTime) throw new Error("endTime must be later than startTime");
  }
}
