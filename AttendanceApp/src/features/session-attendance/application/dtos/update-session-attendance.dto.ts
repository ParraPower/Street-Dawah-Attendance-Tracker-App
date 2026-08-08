export class UpdateSessionAttendanceDto {
  sessionOccurrenceId?: number;
  userId?: number;
  attended?: boolean;
  arrivalTime?: string | null;
  departureTime?: string | null;
  updatedBy?: number;
}
