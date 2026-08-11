import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirDateAvailabilityEntity } from "../../domain/entities/emir-date-availability-entity";
import { IEmirDateAvailabilityRepository } from "../../domain/repositories/iemir-date-availability-repository";
import { EmirDateAvailabilityService } from "../../domain/services/emir-date-availability-service";
import { EmirDateAvailabilityDto } from "../dtos/emir-date-availability.dto";

export class GetEmirDateAvailabilitiesByDateUseCase {
  constructor(private readonly repo: IEmirDateAvailabilityRepository, private readonly service: EmirDateAvailabilityService) {}
  async execute(date: string): Promise<EmirDateAvailabilityDto[]> {
    return (await this.repo.findByDate(this.service.normalizeDate(date))).map((item) => mapper.map(item, EmirDateAvailabilityEntity, EmirDateAvailabilityDto));
  }
}
