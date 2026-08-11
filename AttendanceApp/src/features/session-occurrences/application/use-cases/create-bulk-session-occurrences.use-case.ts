import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateBulkSessionOccurrencesDto } from "../dtos/create-bulk-session-occurrences.dto";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceService } from "../../domain/services/session-occurrence-service";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { SessionOccurrenceActor, SessionOccurrenceAuthorizationService } from "../authorization/session-occurrence-authorization.service";

export class CreateBulkSessionOccurrencesUseCase {
  constructor(
    private readonly repo: ISessionOccurrenceRepository,
    private readonly service: SessionOccurrenceService,
    private readonly authorization: SessionOccurrenceAuthorizationService,
  ) {}

  async execute(input: CreateBulkSessionOccurrencesDto, actor: SessionOccurrenceActor): Promise<SessionOccurrenceDto[]> {
    this.authorization.assertCanBulkCreate(actor);
    if (!Array.isArray(input.occurrences) || input.occurrences.length === 0) {
      throw new Error("At least one session occurrence is required");
    }

    const seen = new Set<string>();
    const occurrences = input.occurrences.map((value) => {
      this.authorization.assertCanCreate(actor, value);
      const sessionId = this.service.validateSessionId(value.sessionId);
      const occurrenceDate = this.service.normalizeDate(value.occurrenceDate);
      this.service.validateCount(value.NoOfShahadahs, "NoOfShahadahs");
      this.service.validateCount(value.NoOfQuransDistributed, "NoOfQuransDistributed");
      this.service.validateShowPublicly(value.showPublicly);
      this.service.validateMainEmirUserId(value.mainEmirUserId);

      const key = `${sessionId}:${occurrenceDate}`;
      if (seen.has(key)) throw new Error("Duplicate session occurrence in request");
      seen.add(key);
      return { ...value, sessionId, occurrenceDate };
    });

    for (const occurrence of occurrences) {
      if (await this.repo.findBySessionAndDate(occurrence.sessionId, occurrence.occurrenceDate)) {
        throw new Error("Session occurrence already exists");
      }
    }

    const created = await this.repo.createBulk(occurrences);
    return created.map((occurrence) => mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto));
  }
}
