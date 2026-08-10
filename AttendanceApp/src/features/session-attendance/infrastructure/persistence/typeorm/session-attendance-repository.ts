import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { SessionAttendanceEntity } from "../../../domain/entities/session-attendance-entity";
import { ISessionAttendanceRepository } from "../../../domain/repositories/isession-attendance-repository";

export class SessionAttendanceRepository extends BaseRepository<SessionAttendanceEntity> implements ISessionAttendanceRepository {
  constructor(repo: Repository<SessionAttendanceEntity>) { super(repo); }
  findById(id: number): Promise<SessionAttendanceEntity | null> { return this.findOne({ where: { id } }); }
  findAll(): Promise<SessionAttendanceEntity[]> { return this.find(); }
  findByUserId(userId: number): Promise<SessionAttendanceEntity[]> {
    return this.repo.createQueryBuilder("attendance").where("attendance.userId = :userId", { userId }).andWhere("attendance.isDeleted IS NOT TRUE").getMany();
  }
  findBySessionOccurrenceId(sessionOccurrenceId: number): Promise<SessionAttendanceEntity[]> {
    return this.repo.createQueryBuilder("attendance").where("attendance.sessionOccurrenceId = :sessionOccurrenceId", { sessionOccurrenceId }).andWhere("attendance.isDeleted IS NOT TRUE").getMany();
  }
  findBySessionOccurrenceAndUser(sessionOccurrenceId: number, userId: number, excludeId?: number): Promise<SessionAttendanceEntity | null> {
    const query = this.repo.createQueryBuilder("attendance")
      .where("attendance.sessionOccurrenceId = :sessionOccurrenceId", { sessionOccurrenceId })
      .andWhere("attendance.userId = :userId", { userId })
      .andWhere("attendance.isDeleted IS NOT TRUE");
    if (excludeId !== undefined) query.andWhere("attendance.id != :excludeId", { excludeId });
    return query.getOne();
  }
  async create(attendance: Partial<SessionAttendanceEntity>): Promise<SessionAttendanceEntity> { return this.repo.save(this.repo.create(attendance)); }
  async update(id: number, attendance: Partial<SessionAttendanceEntity>): Promise<SessionAttendanceEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, attendance);
    return this.repo.save(existing);
  }
  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
  async createBulk(attendances: Partial<SessionAttendanceEntity>[]): Promise<SessionAttendanceEntity[]> {
    return this.repo.manager.transaction(async (manager) => manager.save(SessionAttendanceEntity, attendances.map((attendance) => manager.create(SessionAttendanceEntity, attendance))));
  }
}
