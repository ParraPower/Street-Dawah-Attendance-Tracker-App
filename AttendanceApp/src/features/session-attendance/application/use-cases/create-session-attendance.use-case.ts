import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateSessionAttendanceDto } from "../dtos/create-session-attendance.dto";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";
import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";
import { SessionAttendanceService } from "../../domain/services/session-attendance-service";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";

export class CreateSessionAttendanceUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository, private readonly service: SessionAttendanceService) {}
  async execute(input: CreateSessionAttendanceDto): Promise<SessionAttendanceDto> {
    const sessionOccurrenceId = this.service.validateId(input.sessionOccurrenceId, "sessionOccurrenceId");
    const userId = this.service.validateId(input.userId, "userId");
    const attended = this.service.validateAttended(input.attended) ?? false;
    const arrivalTime = this.service.normalizeTime(input.arrivalTime, "arrivalTime");
    const departureTime = this.service.normalizeTime(input.departureTime, "departureTime");
    this.service.validateTimeRange(arrivalTime, departureTime);
    if (await this.repo.findBySessionOccurrenceAndUser(sessionOccurrenceId, userId)) throw new Error("Session attendance already exists");
    return mapper.map(await this.repo.create({ ...input, sessionOccurrenceId, userId, attended, arrivalTime, departureTime }), SessionAttendanceEntity, SessionAttendanceDto);
  }
}
