import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateBulkSessionAttendanceDto } from "../dtos/create-bulk-session-attendance.dto";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";
import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";
import { SessionAttendanceService } from "../../domain/services/session-attendance-service";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";

export class CreateBulkSessionAttendanceUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository, private readonly service: SessionAttendanceService) {}
  async execute(input: CreateBulkSessionAttendanceDto): Promise<SessionAttendanceDto[]> {
    if (!Array.isArray(input.attendances) || input.attendances.length === 0) throw new Error("At least one attendance is required");
    const seen = new Set<string>();
    const values = input.attendances.map((attendance) => {
      const sessionOccurrenceId = this.service.validateId(attendance.sessionOccurrenceId, "sessionOccurrenceId");
      const userId = this.service.validateId(attendance.userId, "userId");
      const key = `${sessionOccurrenceId}:${userId}`;
      if (seen.has(key)) throw new Error("Duplicate session attendance in request");
      seen.add(key);
      const attended = this.service.validateAttended(attendance.attended) ?? false;
      const arrivalTime = this.service.normalizeTime(attendance.arrivalTime, "arrivalTime");
      const departureTime = this.service.normalizeTime(attendance.departureTime, "departureTime");
      this.service.validateTimeRange(arrivalTime, departureTime);
      return { ...attendance, sessionOccurrenceId, userId, attended, arrivalTime, departureTime };
    });
    for (const value of values) {
      if (await this.repo.findBySessionOccurrenceAndUser(value.sessionOccurrenceId, value.userId)) throw new Error("Session attendance already exists");
    }
    return (await this.repo.createBulk(values)).map((attendance) => mapper.map(attendance, SessionAttendanceEntity, SessionAttendanceDto));
  }
}
