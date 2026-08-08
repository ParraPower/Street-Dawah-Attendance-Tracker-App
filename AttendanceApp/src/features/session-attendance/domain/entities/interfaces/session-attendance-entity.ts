export interface ISessionAttendanceEntity {
  sessionOccurrenceId: number;
  userId: number;
  attended: boolean;
  arrivalTime?: string | null;
  departureTime?: string | null;
}
