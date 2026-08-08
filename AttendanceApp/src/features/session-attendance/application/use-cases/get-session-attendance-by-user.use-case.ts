import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";

export class GetSessionAttendanceByUserUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository) {}
  async execute(userId: number): Promise<SessionAttendanceDto[]> {
    return (await this.repo.findByUserId(userId)).map((attendance) => mapper.map(attendance, SessionAttendanceEntity, SessionAttendanceDto));
  }
}
