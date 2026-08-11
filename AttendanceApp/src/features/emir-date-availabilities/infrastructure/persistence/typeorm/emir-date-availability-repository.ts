import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { EmirDateAvailabilityEntity } from "../../../domain/entities/emir-date-availability-entity";
import { IEmirDateAvailabilityRepository } from "../../../domain/repositories/iemir-date-availability-repository";

export class EmirDateAvailabilityRepository extends BaseRepository<EmirDateAvailabilityEntity> implements IEmirDateAvailabilityRepository {
  constructor(repo: Repository<EmirDateAvailabilityEntity>) { super(repo); }

  findById(id: number): Promise<EmirDateAvailabilityEntity | null> { return this.findOne({ where: { id } }); }
  findAll(): Promise<EmirDateAvailabilityEntity[]> { return this.find(); }
  findByUserId(userId: number): Promise<EmirDateAvailabilityEntity[]> { return this.find({ where: { userId } }); }
  findByDate(availabilityDate: Date): Promise<EmirDateAvailabilityEntity[]> { return this.find({ where: { availabilityDate } }); }
  findByUserAndDate(userId: number, availabilityDate: Date): Promise<EmirDateAvailabilityEntity | null> {
    return this.findOne({ where: { userId, availabilityDate } });
  }
  async create(availability: Partial<EmirDateAvailabilityEntity>): Promise<EmirDateAvailabilityEntity> {
    return this.repo.save(this.repo.create(availability));
  }
  async update(id: number, availability: Partial<EmirDateAvailabilityEntity>): Promise<EmirDateAvailabilityEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, availability);
    return this.repo.save(existing);
  }
  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
}
