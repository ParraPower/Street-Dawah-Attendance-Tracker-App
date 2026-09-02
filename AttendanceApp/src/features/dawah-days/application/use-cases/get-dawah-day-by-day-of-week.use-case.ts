import { mapper } from "../../../../infrastructure/mapping/mapper";
import { DawahDayEntity } from "../../domain/entities/dawah-day-entity";
import { IDawahDayRepository } from "../../domain/repositories/idawah-day-repository";
import { DawahDayService } from "../../domain/services/dawah-day-service";
import { DawahDayDto } from "../dtos/dawah-day.dto";

export class GetDawahDayByDayOfWeekUseCase {
  constructor(private readonly repo: IDawahDayRepository, private readonly service: DawahDayService) {}
  async execute(dayOfWeek: number): Promise<DawahDayDto | null> {
    const day = await this.repo.findByDayOfWeek(this.service.validateDayOfWeek(dayOfWeek));
    return day ? mapper.map(day, DawahDayEntity, DawahDayDto) : null;
  }
}
