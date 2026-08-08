export class CreateSessionDto {
  name!: string;
  locationId!: number;
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
  createdBy?: number;
}
