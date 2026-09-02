import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { EmirSessionPreferenceEntity } from "../../../domain/entities/emir-session-preference-entity";
import { IEmirSessionPreferenceRepository } from "../../../domain/repositories/iemir-session-preference-repository";

export class EmirSessionPreferenceRepository extends BaseRepository<EmirSessionPreferenceEntity> implements IEmirSessionPreferenceRepository {
  constructor(repo: Repository<EmirSessionPreferenceEntity>) { super(repo); }

  findById(id: number): Promise<EmirSessionPreferenceEntity | null> { return this.findOne({ where: { id } }); }
  findAll(): Promise<EmirSessionPreferenceEntity[]> { return this.find(); }

  findByUserId(userId: number): Promise<EmirSessionPreferenceEntity[]> {
    return this.repo.createQueryBuilder("preference")
      .where("preference.userId = :userId", { userId })
      .andWhere("preference.isDeleted IS NOT TRUE")
      .getMany();
  }

  findBySessionId(sessionId: number): Promise<EmirSessionPreferenceEntity[]> {
    return this.repo.createQueryBuilder("preference")
      .where("preference.sessionId = :sessionId", { sessionId })
      .andWhere("preference.isDeleted IS NOT TRUE")
      .getMany();
  }

  findByUserAndSession(userId: number, sessionId: number, excludeId?: number): Promise<EmirSessionPreferenceEntity | null> {
    const query = this.repo.createQueryBuilder("preference")
      .where("preference.userId = :userId", { userId })
      .andWhere("preference.sessionId = :sessionId", { sessionId })
      .andWhere("preference.isDeleted IS NOT TRUE");
    if (excludeId !== undefined) query.andWhere("preference.id != :excludeId", { excludeId });
    return query.getOne();
  }

  async create(preference: Partial<EmirSessionPreferenceEntity>): Promise<EmirSessionPreferenceEntity> {
    return this.repo.save(this.repo.create(preference));
  }

  async update(id: number, preference: Partial<EmirSessionPreferenceEntity>): Promise<EmirSessionPreferenceEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, preference);
    return this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
}
