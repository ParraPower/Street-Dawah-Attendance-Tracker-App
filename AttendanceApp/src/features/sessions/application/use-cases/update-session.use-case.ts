import { ISessionRepository } from "../../domain/repositories/isession-repository";
import { SessionService } from "../../domain/services/session-service";
import { UpdateSessionDto } from "../dtos/update-session.dto";
import { SessionDto } from "../dtos/session.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { SessionEntity } from "../../domain/entities/session-entity";

export class UpdateSessionUseCase {
  constructor(private readonly repo: ISessionRepository, private readonly service: SessionService) {}
  async execute(id: number, input: UpdateSessionDto): Promise<SessionDto | null> {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    const locationId = input.locationId ?? existing.locationId;
    if (!Number.isInteger(locationId) || locationId <= 0) throw new Error("A valid locationId is required");
    const dayOfWeek = this.service.validateDayOfWeek(input.dayOfWeek ?? existing.dayOfWeek);
    const startTime = this.service.normalizeTime(input.startTime ?? existing.startTime);
    const endTime = this.service.normalizeTime(input.endTime ?? existing.endTime);
    this.service.validateTimeRange(startTime, endTime);
    if (await this.repo.findBySchedule(locationId, dayOfWeek, startTime, endTime, id)) throw new Error("Session already exists");
    if (await this.repo.hasOverlap(locationId, dayOfWeek, startTime, endTime, id)) throw new Error("Session overlaps an existing session");
    const update = { ...input, locationId, dayOfWeek, startTime, endTime };
    if (input.name !== undefined) {
      if (!input.name.trim()) throw new Error("Session name is required");
      update.name = input.name.trim();
    }
    return mapper.map((await this.repo.update(id, update))!, SessionEntity, SessionDto);
  }
}
