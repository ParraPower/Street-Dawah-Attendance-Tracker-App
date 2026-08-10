import { mapper } from "../../../../infrastructure/mapping/mapper";
import { UpdateSessionOccurrenceDto } from "../dtos/update-session-occurrence.dto";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceService } from "../../domain/services/session-occurrence-service";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";

export class UpdateSessionOccurrenceUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository, private readonly service: SessionOccurrenceService) {}
  async execute(id: number, input: UpdateSessionOccurrenceDto): Promise<SessionOccurrenceDto | null> {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    const sessionId = this.service.validateSessionId(input.sessionId ?? existing.sessionId);
    const occurrenceDate = this.service.normalizeDate(input.occurrenceDate ?? existing.occurrenceDate);
    this.service.validateCount(input.NoOfShahadahs, "NoOfShahadahs");
    this.service.validateCount(input.NoOfQuransDistributed, "NoOfQuransDistributed");
    if (await this.repo.findBySessionAndDate(sessionId, occurrenceDate, id)) throw new Error("Session occurrence already exists");
    const occurrence = await this.repo.update(id, { ...input, sessionId, occurrenceDate });
    return occurrence ? mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto) : null;
  }
}