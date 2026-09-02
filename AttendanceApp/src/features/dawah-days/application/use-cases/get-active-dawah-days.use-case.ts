import { mapper } from "../../../../infrastructure/mapping/mapper";
import { DawahDayDto } from "../dtos/dawah-day.dto";
import { DawahDayEntity } from "../../domain/entities/dawah-day-entity";
import { IDawahDayRepository } from "../../domain/repositories/idawah-day-repository";

export class GetActiveDawahDaysUseCase {
  constructor(private readonly repo: IDawahDayRepository) {}
  async execute(): Promise<DawahDayDto[]> {
    return (await this.repo.findActive()).map((day) => mapper.map(day, DawahDayEntity, DawahDayDto));
  }
}
