import { CreateSessionAttendanceDto } from "./create-session-attendance.dto";

export class CreateBulkSessionAttendanceDto {
  attendances!: CreateSessionAttendanceDto[];
}
