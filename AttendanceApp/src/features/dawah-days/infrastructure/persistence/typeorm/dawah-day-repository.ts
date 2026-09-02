import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { DawahDayEntity } from "../../../domain/entities/dawah-day-entity";
import { IDawahDayRepository } from "../../../domain/repositories/idawah-day-repository";

export class DawahDayRepository extends BaseRepository<DawahDayEntity> implements IDawahDayRepository {
  constructor(repo: Repository<DawahDayEntity>) { super(repo); }

  findById(id: number): Promise<DawahDayEntity | null> { return this.findOne({ where: { id } }); }
  findAll(): Promise<DawahDayEntity[]> { return this.find(); }
  findByDayOfWeek(dayOfWeek: number): Promise<DawahDayEntity | null> {
    return this.findOne({ where: { dayOfWeek } });
  }
  findActive(): Promise<DawahDayEntity[]> { return this.find({ where: { active: true } }); }
  async create(day: Partial<DawahDayEntity>): Promise<DawahDayEntity> {
    return this.repo.save(this.repo.create(day));
  }
  async update(id: number, day: Partial<DawahDayEntity>): Promise<DawahDayEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, day);
    return this.repo.save(existing);
  }
  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
}
