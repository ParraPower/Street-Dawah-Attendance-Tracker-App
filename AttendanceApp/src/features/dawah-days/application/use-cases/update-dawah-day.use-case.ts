import { mapper } from "../../../../infrastructure/mapping/mapper";
import { DawahDayEntity } from "../../domain/entities/dawah-day-entity";
import { IDawahDayRepository } from "../../domain/repositories/idawah-day-repository";
import { DawahDayDto } from "../dtos/dawah-day.dto";
import { UpdateDawahDayDto } from "../dtos/update-dawah-day.dto";

export class UpdateDawahDayUseCase {
  constructor(private readonly repo: IDawahDayRepository) {}
  async execute(id: number, input: UpdateDawahDayDto): Promise<DawahDayDto | null> {
    const day = await this.repo.update(id, input);
    return day ? mapper.map(day, DawahDayEntity, DawahDayDto) : null;
  }
}
