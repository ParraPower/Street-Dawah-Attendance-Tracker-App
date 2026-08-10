import { ILocationRepository } from "../../domain/repositories/ilocation-repository";
import { LocationDto } from "../dtos/location.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { LocationEntity } from "../../domain/entities/location-entity";

export class GetLocationsUseCase {
  constructor(private readonly repo: ILocationRepository) {}
  async execute(): Promise<LocationDto[]> { return (await this.repo.findAll()).map((location) => mapper.map(location, LocationEntity, LocationDto)); }
}