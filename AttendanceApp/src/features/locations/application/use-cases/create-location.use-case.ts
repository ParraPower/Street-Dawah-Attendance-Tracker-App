import { CreateLocationDto } from "../dtos/create-location.dto";
import { LocationDto } from "../dtos/location.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ILocationRepository } from "../../domain/repositories/ilocation-repository";
import { LocationService } from "../../domain/services/location-service";
import { LocationEntity } from "../../domain/entities/location-entity";

export class CreateLocationUseCase {
  constructor(private readonly repo: ILocationRepository, private readonly service: LocationService) {}
  async execute(input: CreateLocationDto): Promise<LocationDto> {
    const name = this.service.normalizeName(input.name || "");
    const postcode = this.service.normalizePostcode(input.postcode || "");
    if (!name || !postcode) throw new Error("Location name and postcode are required");
    if (await this.repo.findByNameAndPostcode(name, postcode)) throw new Error("Location already exists");
    return mapper.map(await this.repo.create({ ...input, name, postcode }), LocationEntity, LocationDto);
  }
}