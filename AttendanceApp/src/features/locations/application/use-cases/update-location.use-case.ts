import { ILocationRepository } from "../../domain/repositories/ilocation-repository";
import { UpdateLocationDto } from "../dtos/update-location.dto";
import { LocationDto } from "../dtos/location.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { LocationService } from "../../domain/services/location-service";
import { LocationEntity } from "../../domain/entities/location-entity";

export class UpdateLocationUseCase {
  constructor(private readonly repo: ILocationRepository, private readonly service: LocationService) {}
  async execute(id: number, input: UpdateLocationDto): Promise<LocationDto | null> {
    const update = { ...input };
    if (input.name !== undefined) update.name = this.service.normalizeName(input.name);
    if (input.postcode !== undefined) update.postcode = this.service.normalizePostcode(input.postcode);
    const location = await this.repo.update(id, update);
    return location ? mapper.map(location, LocationEntity, LocationDto) : null;
  }
}