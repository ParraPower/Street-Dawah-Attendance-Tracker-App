import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";

export class GetSessionAttendancesUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository) {}
  async execute(): Promise<SessionAttendanceDto[]> {
    return (await this.repo.findAll()).map((attendance) => mapper.map(attendance, SessionAttendanceEntity, SessionAttendanceDto));
  }
}
