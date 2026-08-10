import { CreateLocationDto } from "../dtos/create-location.dto";
import { CreateBulkLocationsResponseDto } from "../dtos/create-bulk-locations-response.dto";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { LocationDto } from "../dtos/location.dto";
import { ILocationRepository } from "../../domain/repositories/ilocation-repository";
import { LocationService } from "../../domain/services/location-service";
import { LocationEntity } from "../../domain/entities/location-entity";

export class CreateBulkLocationsUseCase {
  constructor(private readonly repo: ILocationRepository, private readonly service: LocationService) {}
  async execute(inputs: CreateLocationDto[]): Promise<CreateBulkLocationsResponseDto> {
    const existing = await this.repo.findAll();
    const keys = new Set(existing.filter((x) => this.service.isActive(x)).map((x) => `${x.name}|${x.postcode}`));
    const omittedLocations: LocationDto[] = [];
    const entities = inputs.map((input) => ({ ...input, name: this.service.normalizeName(input.name || ""), postcode: this.service.normalizePostcode(input.postcode || "") }))
      .filter((input) => { const key = `${input.name}|${input.postcode}`; if (!input.name || !input.postcode || keys.has(key)) return false; keys.add(key); return true; }) as LocationEntity[];
    const created = await this.repo.createBulk(entities);
    return { createdLocations: created.map((location) => mapper.map(location, LocationEntity, LocationDto)), omittedLocations };
  }
}