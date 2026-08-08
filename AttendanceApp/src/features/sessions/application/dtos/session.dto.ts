export class SessionDto {
  id!: number;
  name!: string;
  locationId!: number;
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}
