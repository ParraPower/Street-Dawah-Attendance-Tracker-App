import { LocationEntity } from "../entities/location-entity";

export interface ILocationRepository {
  findById(id: number): Promise<LocationEntity | null>;
  findByNameAndPostcode(name: string, postcode: string): Promise<LocationEntity | null>;
  findAll(): Promise<LocationEntity[]>;
  create(location: Partial<LocationEntity>): Promise<LocationEntity>;
  createBulk(locations: LocationEntity[]): Promise<LocationEntity[]>;
  update(id: number, location: Partial<LocationEntity>): Promise<LocationEntity | null>;
  delete(id: number): Promise<boolean>;
}