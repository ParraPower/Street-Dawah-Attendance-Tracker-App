import { mapper } from "../../../../infrastructure/mapping/mapper";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceActor, SessionOccurrenceAuthorizationService } from "../authorization/session-occurrence-authorization.service";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";

export class GetCurrentWeekSessionOccurrencesUseCase {
  constructor(
    private readonly repo: ISessionOccurrenceRepository,
    private readonly authorization: SessionOccurrenceAuthorizationService,
  ) {}

  async execute(actor: SessionOccurrenceActor, today = new Date()): Promise<SessionOccurrenceDto[]> {
    const currentDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const start = new Date(currentDate);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);

    const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);
    const occurrences = await this.repo.findByDateRange(
      toDateOnly(start),
      toDateOnly(end),
      this.authorization.canViewNonPublic(actor),
    );
    return occurrences.map((occurrence) => mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto));
  }
}
