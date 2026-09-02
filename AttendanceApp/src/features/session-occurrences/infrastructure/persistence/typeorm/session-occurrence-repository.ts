import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { SessionOccurrenceEntity } from "../../../domain/entities/session-occurrence-entity";
import { ISessionOccurrenceRepository } from "../../../domain/repositories/isession-occurrence-repository";

export class SessionOccurrenceRepository extends BaseRepository<SessionOccurrenceEntity> implements ISessionOccurrenceRepository {
  constructor(repo: Repository<SessionOccurrenceEntity>) { super(repo); }
  findById(id: number): Promise<SessionOccurrenceEntity | null> { return this.findOne({ where: { id } }); }
  findAll(): Promise<SessionOccurrenceEntity[]> { return this.find(); }
  findPublic(): Promise<SessionOccurrenceEntity[]> {
    return this.repo.createQueryBuilder("occurrence")
      .where('occurrence."showPublicly" IS TRUE')
      .andWhere('occurrence."isDeleted" IS NOT TRUE')
      .getMany();
  }
  findByDateRange(startDate: string, endDate: string, includeNonPublic: boolean): Promise<SessionOccurrenceEntity[]> {
    const query = this.repo.createQueryBuilder("occurrence")
      .where("occurrence.occurrenceDate >= :startDate", { startDate })
      .andWhere("occurrence.occurrenceDate <= :endDate", { endDate })
      .andWhere("occurrence.isDeleted IS NOT TRUE");
    if (!includeNonPublic) query.andWhere('occurrence."showPublicly" IS TRUE');
    return query.orderBy("occurrence.occurrenceDate", "ASC").addOrderBy("occurrence.sessionId", "ASC").getMany();
  }
  findPublicById(id: number): Promise<SessionOccurrenceEntity | null> {
    return this.repo.createQueryBuilder("occurrence")
      .where('occurrence."id" = :id', { id })
      .andWhere('occurrence."showPublicly" IS TRUE')
      .andWhere('occurrence."isDeleted" IS NOT TRUE')
      .getOne();
  }
  findBySessionAndDate(sessionId: number, occurrenceDate: string, excludeId?: number): Promise<SessionOccurrenceEntity | null> {
    const query = this.repo.createQueryBuilder("occurrence")
      .where("occurrence.sessionId = :sessionId", { sessionId })
      .andWhere("occurrence.occurrenceDate = :occurrenceDate", { occurrenceDate })
      .andWhere("occurrence.isDeleted IS NOT TRUE");
    if (excludeId !== undefined) query.andWhere("occurrence.id != :excludeId", { excludeId });
    return query.getOne();
  }
  async create(occurrence: Partial<SessionOccurrenceEntity>): Promise<SessionOccurrenceEntity> { return this.repo.save(this.repo.create(occurrence)); }
  async createBulk(occurrences: Partial<SessionOccurrenceEntity>[]): Promise<SessionOccurrenceEntity[]> {
    return this.repo.manager.transaction(async (manager) => manager.save(SessionOccurrenceEntity, occurrences.map((occurrence) => manager.create(SessionOccurrenceEntity, occurrence))));
  }
  async update(id: number, occurrence: Partial<SessionOccurrenceEntity>): Promise<SessionOccurrenceEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, occurrence);
    return this.repo.save(existing);
  }
  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
}