import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateSessionOccurrenceDto } from "../dtos/create-session-occurrence.dto";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceService } from "../../domain/services/session-occurrence-service";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";

export class CreateSessionOccurrenceUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository, private readonly service: SessionOccurrenceService) {}
  async execute(input: CreateSessionOccurrenceDto): Promise<SessionOccurrenceDto> {
    const sessionId = this.service.validateSessionId(input.sessionId);
    const occurrenceDate = this.service.normalizeDate(input.occurrenceDate);
    this.service.validateCount(input.NoOfShahadahs, "NoOfShahadahs");
    this.service.validateCount(input.NoOfQuransDistributed, "NoOfQuransDistributed");
    if (await this.repo.findBySessionAndDate(sessionId, occurrenceDate)) throw new Error("Session occurrence already exists");
    return mapper.map(await this.repo.create({ ...input, sessionId, occurrenceDate }), SessionOccurrenceEntity, SessionOccurrenceDto);
  }
}