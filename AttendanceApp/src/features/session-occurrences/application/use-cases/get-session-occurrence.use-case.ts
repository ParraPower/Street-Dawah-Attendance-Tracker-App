import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { SessionOccurrenceActor, SessionOccurrenceAuthorizationService } from "../authorization/session-occurrence-authorization.service";

export class GetSessionOccurrenceUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository, private readonly authorization: SessionOccurrenceAuthorizationService) {}
  async execute(id: number, actor: SessionOccurrenceActor): Promise<SessionOccurrenceDto | null> {
    const occurrence = this.authorization.canViewNonPublic(actor) ? await this.repo.findById(id) : await this.repo.findPublicById(id);
    return occurrence ? mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto) : null;
  }
}