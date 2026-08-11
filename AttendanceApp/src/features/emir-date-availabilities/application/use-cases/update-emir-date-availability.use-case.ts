import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirDateAvailabilityEntity } from "../../domain/entities/emir-date-availability-entity";
import { IEmirDateAvailabilityRepository } from "../../domain/repositories/iemir-date-availability-repository";
import { EmirDateAvailabilityDto } from "../dtos/emir-date-availability.dto";
import { UpdateEmirDateAvailabilityDto } from "../dtos/update-emir-date-availability.dto";
import { EmirDateAvailabilityService } from "../../domain/services/emir-date-availability-service";

export class UpdateEmirDateAvailabilityUseCase {
  constructor(private readonly repo: IEmirDateAvailabilityRepository, private readonly service: EmirDateAvailabilityService) {}
  async execute(id: number, input: UpdateEmirDateAvailabilityDto): Promise<EmirDateAvailabilityDto | null> {
    const active = input.active === undefined ? undefined : this.service.validateActive(input.active);
    const result = await this.repo.update(id, active === undefined ? {} : { active });
    return result ? mapper.map(result, EmirDateAvailabilityEntity, EmirDateAvailabilityDto) : null;
  }
}
