import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateSessionOccurrenceDto } from "../dtos/create-session-occurrence.dto";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceService } from "../../domain/services/session-occurrence-service";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { SessionOccurrenceActor, SessionOccurrenceAuthorizationService } from "../authorization/session-occurrence-authorization.service";

export class CreateSessionOccurrenceUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository, private readonly service: SessionOccurrenceService, private readonly authorization: SessionOccurrenceAuthorizationService) {}
  async execute(input: CreateSessionOccurrenceDto, actor: SessionOccurrenceActor): Promise<SessionOccurrenceDto> {
    this.authorization.assertCanCreate(actor, input);
    const sessionId = this.service.validateSessionId(input.sessionId);
    const occurrenceDate = this.service.normalizeDate(input.occurrenceDate);
    this.service.validateCount(input.NoOfShahadahs, "NoOfShahadahs");
    this.service.validateCount(input.NoOfQuransDistributed, "NoOfQuransDistributed");
    this.service.validateShowPublicly(input.showPublicly);
    this.service.validateMainEmirUserId(input.mainEmirUserId);
    if (await this.repo.findBySessionAndDate(sessionId, occurrenceDate)) throw new Error("Session occurrence already exists");
    return mapper.map(await this.repo.create({ ...input, sessionId, occurrenceDate }), SessionOccurrenceEntity, SessionOccurrenceDto);
  }
}