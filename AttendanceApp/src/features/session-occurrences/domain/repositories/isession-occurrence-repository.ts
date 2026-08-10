import { SessionOccurrenceEntity } from "../entities/session-occurrence-entity";

export interface ISessionOccurrenceRepository {
  findById(id: number): Promise<SessionOccurrenceEntity | null>;
  findAll(): Promise<SessionOccurrenceEntity[]>;
  findPublic(): Promise<SessionOccurrenceEntity[]>;
  findPublicById(id: number): Promise<SessionOccurrenceEntity | null>;
  findBySessionAndDate(sessionId: number, occurrenceDate: string, excludeId?: number): Promise<SessionOccurrenceEntity | null>;
  create(occurrence: Partial<SessionOccurrenceEntity>): Promise<SessionOccurrenceEntity>;
  update(id: number, occurrence: Partial<SessionOccurrenceEntity>): Promise<SessionOccurrenceEntity | null>;
  delete(id: number): Promise<boolean>;
}