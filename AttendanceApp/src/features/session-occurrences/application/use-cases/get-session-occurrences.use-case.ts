import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { SessionOccurrenceActor, SessionOccurrenceAuthorizationService } from "../authorization/session-occurrence-authorization.service";

export class GetSessionOccurrencesUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository, private readonly authorization: SessionOccurrenceAuthorizationService) {}
  async execute(actor: SessionOccurrenceActor): Promise<SessionOccurrenceDto[]> {
    const occurrences = this.authorization.canViewNonPublic(actor) ? await this.repo.findAll() : await this.repo.findPublic();
    return occurrences.map((occurrence) => mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto));
  }
}