import { Repository } from "typeorm";
import { BaseRepository } from "app-framework";
import { LocationEntity } from "../../../domain/entities/location-entity";
import { ILocationRepository } from "../../../domain/repositories/ilocation-repository";

export class LocationRepository extends BaseRepository<LocationEntity> implements ILocationRepository {
  constructor(repo: Repository<LocationEntity>) { super(repo); }
  findById(id: number): Promise<LocationEntity | null> { return this.findOne({ where: { id } }); }
  findByNameAndPostcode(name: string, postcode: string): Promise<LocationEntity | null> { return this.findOne({ where: { name, postcode } }); }
  findAll(): Promise<LocationEntity[]> { return this.find(); }
  async create(location: Partial<LocationEntity>): Promise<LocationEntity> { return this.repo.save(this.repo.create(location)); }
  async createBulk(locations: LocationEntity[]): Promise<LocationEntity[]> { return this.repo.manager.transaction((trx) => trx.save(LocationEntity, locations)); }
  async update(id: number, location: Partial<LocationEntity>): Promise<LocationEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, location);
    return this.repo.save(existing);
  }
  async delete(id: number): Promise<boolean> { await this.softDelete(id); return true; }
}