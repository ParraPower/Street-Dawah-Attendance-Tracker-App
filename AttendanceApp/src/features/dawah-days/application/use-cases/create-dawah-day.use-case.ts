import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateDawahDayDto } from "../dtos/create-dawah-day.dto";
import { DawahDayDto } from "../dtos/dawah-day.dto";
import { DawahDayEntity } from "../../domain/entities/dawah-day-entity";
import { IDawahDayRepository } from "../../domain/repositories/idawah-day-repository";
import { DawahDayService } from "../../domain/services/dawah-day-service";

export class CreateDawahDayUseCase {
  constructor(private readonly repo: IDawahDayRepository, private readonly service: DawahDayService) {}

  async execute(input: CreateDawahDayDto): Promise<DawahDayDto> {
    const dayOfWeek = this.service.validateDayOfWeek(input.dayOfWeek);
    const name = this.service.normalizeName(input.name || "");
    if (!name) throw new Error("Dawah day name is required");
    if (await this.repo.findByDayOfWeek(dayOfWeek)) throw new Error("Dawah day already exists");
    const day = await this.repo.create({ ...input, dayOfWeek, name });
    return mapper.map(day, DawahDayEntity, DawahDayDto);
  }
}
