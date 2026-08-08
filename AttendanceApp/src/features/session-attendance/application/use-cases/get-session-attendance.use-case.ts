import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";

export class GetSessionAttendanceUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository) {}
  async execute(id: number): Promise<SessionAttendanceDto | null> {
    const attendance = await this.repo.findById(id);
    return attendance ? mapper.map(attendance, SessionAttendanceEntity, SessionAttendanceDto) : null;
  }
}
