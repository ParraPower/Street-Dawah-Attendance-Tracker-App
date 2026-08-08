import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { SessionEntity } from "../../../domain/entities/session-entity";
import { ISessionRepository } from "../../../domain/repositories/isession-repository";

export class SessionRepository extends BaseRepository<SessionEntity> implements ISessionRepository {
  constructor(repo: Repository<SessionEntity>) { super(repo); }
  findById(id: number): Promise<SessionEntity | null> { return this.findOne({ where: { id } }); }
  findAll(): Promise<SessionEntity[]> { return this.find(); }
  findBySchedule(locationId: number, dayOfWeek: number, startTime: string, endTime: string, excludeId?: number): Promise<SessionEntity | null> {
    const query = this.repo.createQueryBuilder("session")
      .where("session.locationId = :locationId", { locationId })
      .andWhere("session.dayOfWeek = :dayOfWeek", { dayOfWeek })
      .andWhere("session.isDeleted IS NOT TRUE")
      .andWhere("session.startTime = :startTime", { startTime })
      .andWhere("session.endTime = :endTime", { endTime });
    if (excludeId !== undefined) query.andWhere("session.id != :excludeId", { excludeId });
    return query.getOne();
  }
  async hasOverlap(locationId: number, dayOfWeek: number, startTime: string, endTime: string, excludeId?: number): Promise<boolean> {
    const query = this.repo.createQueryBuilder("session")
      .where("session.locationId = :locationId", { locationId })
      .andWhere("session.dayOfWeek = :dayOfWeek", { dayOfWeek })
      .andWhere("session.isDeleted IS NOT TRUE")
      .andWhere("session.startTime < :endTime", { endTime })
      .andWhere("session.endTime > :startTime", { startTime });
    if (excludeId !== undefined) query.andWhere("session.id != :excludeId", { excludeId });
    return (await query.getCount()) > 0;
  }
  async create(session: Partial<SessionEntity>): Promise<SessionEntity> { return this.repo.save(this.repo.create(session)); }
  async update(id: number, session: Partial<SessionEntity>): Promise<SessionEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, session);
    return this.repo.save(existing);
  }
  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
}
