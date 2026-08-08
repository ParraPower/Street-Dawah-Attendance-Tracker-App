export class SessionAttendanceService {
  validateId(value: number, fieldName: string): number {
    if (!Number.isInteger(value) || value <= 0) throw new Error(`A valid ${fieldName} is required`);
    return value;
  }

  validateAttended(value: boolean | undefined): boolean | undefined {
    if (value !== undefined && typeof value !== "boolean") throw new Error("attended must be a boolean");
    return value;
  }

  normalizeTime(time: string | null | undefined, fieldName: string): string | null | undefined {
    if (time === undefined || time === null) return time;
    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(time);
    if (!match) throw new Error(`${fieldName} must use HH:mm or HH:mm:ss format`);
    const [, hours, minutes, seconds = "00"] = match;
    if (Number(hours) > 23 || Number(minutes) > 59 || Number(seconds) > 59) throw new Error(`Invalid ${fieldName}`);
    return `${hours}:${minutes}:${seconds}`;
  }

  validateTimeRange(arrivalTime?: string | null, departureTime?: string | null): void {
    if (arrivalTime && departureTime && arrivalTime > departureTime) {
      throw new Error("departureTime must be later than or equal to arrivalTime");
    }
  }
}
