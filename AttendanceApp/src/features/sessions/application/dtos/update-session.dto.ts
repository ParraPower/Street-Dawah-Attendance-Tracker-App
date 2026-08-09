import { DayOfWeekEnum } from "../../domain/enums/day-of-week-enum";

export class UpdateSessionDto {
  name?: string;
  locationId?: number;
  dayOfWeek?: DayOfWeekEnum;
  startTime?: string;
  endTime?: string;
  updatedBy?: number;
}
