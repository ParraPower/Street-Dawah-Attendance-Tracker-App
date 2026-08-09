import { DayOfWeekEnum } from "../../domain/enums/day-of-week-enum";

export class SessionDto {
  id!: number;
  name!: string;
  locationId!: number;
  dayOfWeek!: DayOfWeekEnum;
  startTime!: string;
  endTime!: string;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}
