import { DawahDayEntity } from "../entities/dawah-day-entity";

export interface IDawahDayRepository {
  findById(id: number): Promise<DawahDayEntity | null>;
  findAll(): Promise<DawahDayEntity[]>;
  findByDayOfWeek(dayOfWeek: number): Promise<DawahDayEntity | null>;
  findActive(): Promise<DawahDayEntity[]>;
  create(day: Partial<DawahDayEntity>): Promise<DawahDayEntity>;
  update(id: number, day: Partial<DawahDayEntity>): Promise<DawahDayEntity | null>;
  delete(id: number): Promise<boolean>;
}
