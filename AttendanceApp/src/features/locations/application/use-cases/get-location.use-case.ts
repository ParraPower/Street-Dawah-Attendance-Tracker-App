import { ILocationRepository } from "../../domain/repositories/ilocation-repository";
import { LocationDto } from "../dtos/location.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { LocationEntity } from "../../domain/entities/location-entity";

export class GetLocationUseCase {
  constructor(private readonly repo: ILocationRepository) {}
  async execute(id: number): Promise<LocationDto | null> { const location = await this.repo.findById(id); return location ? mapper.map(location, LocationEntity, LocationDto) : null; }
}