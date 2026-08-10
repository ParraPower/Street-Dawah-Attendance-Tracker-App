import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";

export class GetSessionOccurrenceUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository) {}
  async execute(id: number): Promise<SessionOccurrenceDto | null> {
    const occurrence = await this.repo.findById(id);
    return occurrence ? mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto) : null;
  }
}