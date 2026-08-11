import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirDateAvailabilityEntity } from "../../domain/entities/emir-date-availability-entity";
import { IEmirDateAvailabilityRepository } from "../../domain/repositories/iemir-date-availability-repository";
import { EmirDateAvailabilityDto } from "../dtos/emir-date-availability.dto";

export class ToggleEmirDateAvailabilityUseCase {
  constructor(private readonly repo: IEmirDateAvailabilityRepository) {}
  async execute(id: number): Promise<EmirDateAvailabilityDto | null> {
    const current = await this.repo.findById(id);
    if (!current) return null;
    const result = await this.repo.update(id, { active: !current.active });
    return result ? mapper.map(result, EmirDateAvailabilityEntity, EmirDateAvailabilityDto) : null;
  }
}
