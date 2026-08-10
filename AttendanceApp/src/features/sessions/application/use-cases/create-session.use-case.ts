import { CreateSessionDto } from "../dtos/create-session.dto";
import { SessionDto } from "../dtos/session.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionRepository } from "../../domain/repositories/isession-repository";
import { SessionService } from "../../domain/services/session-service";
import { SessionEntity } from "../../domain/entities/session-entity";

export class CreateSessionUseCase {
  constructor(private readonly repo: ISessionRepository, private readonly service: SessionService) {}
  async execute(input: CreateSessionDto): Promise<SessionDto> {
    if (!input.name?.trim() || !Number.isInteger(input.locationId) || input.locationId <= 0) throw new Error("Session name and a valid locationId are required");
    const dayOfWeek = this.service.validateDayOfWeek(input.dayOfWeek);
    const startTime = this.service.normalizeTime(input.startTime);
    const endTime = this.service.normalizeTime(input.endTime);
    this.service.validateTimeRange(startTime, endTime);
    if (await this.repo.findBySchedule(input.locationId, dayOfWeek, startTime, endTime)) throw new Error("Session already exists");
    if (await this.repo.hasOverlap(input.locationId, dayOfWeek, startTime, endTime)) throw new Error("Session overlaps an existing session");
    return mapper.map(await this.repo.create({ ...input, name: input.name.trim(), dayOfWeek, startTime, endTime }), SessionEntity, SessionDto);
  }
}
