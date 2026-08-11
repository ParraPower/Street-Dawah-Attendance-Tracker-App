import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateEmirDateAvailabilityDto } from "../dtos/create-emir-date-availability.dto";
import { EmirDateAvailabilityDto } from "../dtos/emir-date-availability.dto";
import { EmirDateAvailabilityEntity } from "../../domain/entities/emir-date-availability-entity";
import { IEmirDateAvailabilityRepository } from "../../domain/repositories/iemir-date-availability-repository";
import { EmirDateAvailabilityService } from "../../domain/services/emir-date-availability-service";

export class CreateEmirDateAvailabilityUseCase {
  constructor(private readonly repo: IEmirDateAvailabilityRepository, private readonly service: EmirDateAvailabilityService) {}

  async execute(input: CreateEmirDateAvailabilityDto): Promise<EmirDateAvailabilityDto> {
    const userId = this.service.validateUserId(input.userId);
    const availabilityDate = this.service.normalizeDate(input.availabilityDate);
    if (await this.repo.findByUserAndDate(userId, availabilityDate)) throw new Error("Emir date availability already exists");
    const availability = await this.repo.create({ userId, availabilityDate, active: true });
    return mapper.map(availability, EmirDateAvailabilityEntity, EmirDateAvailabilityDto);
  }
}
