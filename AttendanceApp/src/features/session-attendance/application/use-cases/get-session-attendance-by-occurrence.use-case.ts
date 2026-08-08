import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";

export class GetSessionAttendanceByOccurrenceUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository) {}
  async execute(sessionOccurrenceId: number): Promise<SessionAttendanceDto[]> {
    return (await this.repo.findBySessionOccurrenceId(sessionOccurrenceId)).map((attendance) => mapper.map(attendance, SessionAttendanceEntity, SessionAttendanceDto));
  }
}
