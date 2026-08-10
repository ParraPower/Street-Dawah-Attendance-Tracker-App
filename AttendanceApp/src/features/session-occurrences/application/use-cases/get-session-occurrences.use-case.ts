import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";

export class GetSessionOccurrencesUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository) {}
  async execute(): Promise<SessionOccurrenceDto[]> {
    return (await this.repo.findAll()).map((occurrence) => mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto));
  }
}