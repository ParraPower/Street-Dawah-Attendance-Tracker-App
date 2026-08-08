export class CreateSessionAttendanceDto {
  sessionOccurrenceId!: number;
  userId!: number;
  attended?: boolean;
  arrivalTime?: string | null;
  departureTime?: string | null;
  createdBy?: number;
}
