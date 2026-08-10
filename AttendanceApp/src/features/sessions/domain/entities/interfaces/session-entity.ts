import { DayOfWeekEnum } from "../../enums/day-of-week-enum";

export interface ISessionEntity {
  name: string;
  locationId: number;
  dayOfWeek: DayOfWeekEnum;
  startTime: string;
  endTime: string;
}
