import { mapper } from "../../../../infrastructure/mapping/mapper";
import { UpdateSessionAttendanceDto } from "../dtos/update-session-attendance.dto";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";
import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";
import { SessionAttendanceService } from "../../domain/services/session-attendance-service";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";

export class UpdateSessionAttendanceUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository, private readonly service: SessionAttendanceService) {}
  async execute(id: number, input: UpdateSessionAttendanceDto): Promise<SessionAttendanceDto | null> {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    const sessionOccurrenceId = this.service.validateId(input.sessionOccurrenceId ?? existing.sessionOccurrenceId, "sessionOccurrenceId");
    const userId = this.service.validateId(input.userId ?? existing.userId, "userId");
    const attended = this.service.validateAttended(input.attended);
    const arrivalTime = this.service.normalizeTime(input.arrivalTime, "arrivalTime");
    const departureTime = this.service.normalizeTime(input.departureTime, "departureTime");
    const nextArrival = arrivalTime === undefined ? existing.arrivalTime : arrivalTime;
    const nextDeparture = departureTime === undefined ? existing.departureTime : departureTime;
    this.service.validateTimeRange(nextArrival, nextDeparture);
    if (await this.repo.findBySessionOccurrenceAndUser(sessionOccurrenceId, userId, id)) throw new Error("Session attendance already exists");
    const attendance = await this.repo.update(id, { ...input, sessionOccurrenceId, userId, ...(attended === undefined ? {} : { attended }), arrivalTime, departureTime });
    return attendance ? mapper.map(attendance, SessionAttendanceEntity, SessionAttendanceDto) : null;
  }
}
