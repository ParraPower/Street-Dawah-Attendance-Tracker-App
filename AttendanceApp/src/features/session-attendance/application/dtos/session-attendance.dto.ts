export class SessionAttendanceDto {
  id!: number;
  sessionOccurrenceId!: number;
  userId!: number;
  attended!: boolean;
  arrivalTime?: string | null;
  departureTime?: string | null;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}
