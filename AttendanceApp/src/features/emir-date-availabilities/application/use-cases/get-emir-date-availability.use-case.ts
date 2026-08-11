import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirDateAvailabilityEntity } from "../../domain/entities/emir-date-availability-entity";
import { IEmirDateAvailabilityRepository } from "../../domain/repositories/iemir-date-availability-repository";
import { EmirDateAvailabilityDto } from "../dtos/emir-date-availability.dto";

export class GetEmirDateAvailabilityUseCase {
  constructor(private readonly repo: IEmirDateAvailabilityRepository) {}
  async execute(id: number): Promise<EmirDateAvailabilityDto | null> {
    const result = await this.repo.findById(id);
    return result ? mapper.map(result, EmirDateAvailabilityEntity, EmirDateAvailabilityDto) : null;
  }
}
