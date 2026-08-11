import { mapper } from "../../../../infrastructure/mapping/mapper";
import { DawahDayDto } from "../dtos/dawah-day.dto";
import { DawahDayEntity } from "../../domain/entities/dawah-day-entity";
import { IDawahDayRepository } from "../../domain/repositories/idawah-day-repository";

export class GetDawahDayUseCase {
  constructor(private readonly repo: IDawahDayRepository) {}
  async execute(id: number): Promise<DawahDayDto | null> {
    const day = await this.repo.findById(id);
    return day ? mapper.map(day, DawahDayEntity, DawahDayDto) : null;
  }
}
