import { DayOfWeekEnum } from "../../domain/enums/day-of-week-enum";

export class CreateSessionDto {
  name!: string;
  locationId!: number;
  dayOfWeek!: DayOfWeekEnum;
  startTime!: string;
  endTime!: string;
  createdBy?: number;
}
