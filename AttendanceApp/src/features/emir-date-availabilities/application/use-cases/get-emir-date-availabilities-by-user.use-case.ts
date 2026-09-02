import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirDateAvailabilityEntity } from "../../domain/entities/emir-date-availability-entity";
import { IEmirDateAvailabilityRepository } from "../../domain/repositories/iemir-date-availability-repository";
import { EmirDateAvailabilityDto } from "../dtos/emir-date-availability.dto";

export class GetEmirDateAvailabilitiesByUserUseCase {
  constructor(private readonly repo: IEmirDateAvailabilityRepository) {}
  async execute(userId: number): Promise<EmirDateAvailabilityDto[]> {
    return (await this.repo.findByUserId(userId)).map((item) => mapper.map(item, EmirDateAvailabilityEntity, EmirDateAvailabilityDto));
  }
}
