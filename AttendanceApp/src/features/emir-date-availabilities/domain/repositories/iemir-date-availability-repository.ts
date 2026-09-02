import { EmirDateAvailabilityEntity } from "../entities/emir-date-availability-entity";

export interface IEmirDateAvailabilityRepository {
  findById(id: number): Promise<EmirDateAvailabilityEntity | null>;
  findAll(): Promise<EmirDateAvailabilityEntity[]>;
  findByUserId(userId: number): Promise<EmirDateAvailabilityEntity[]>;
  findByDate(date: Date): Promise<EmirDateAvailabilityEntity[]>;
  findByUserAndDate(userId: number, availabilityDate: Date): Promise<EmirDateAvailabilityEntity | null>;
  create(availability: Partial<EmirDateAvailabilityEntity>): Promise<EmirDateAvailabilityEntity>;
  update(id: number, availability: Partial<EmirDateAvailabilityEntity>): Promise<EmirDateAvailabilityEntity | null>;
  delete(id: number): Promise<boolean>;
}
