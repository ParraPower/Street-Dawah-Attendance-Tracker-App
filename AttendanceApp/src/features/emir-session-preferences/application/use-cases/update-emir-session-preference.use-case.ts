import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirSessionPreferenceEntity } from "../../domain/entities/emir-session-preference-entity";
import { IEmirSessionPreferenceRepository } from "../../domain/repositories/iemir-session-preference-repository";
import { EmirSessionPreferenceService } from "../../domain/services/emir-session-preference-service";
import { EmirSessionPreferenceDto } from "../dtos/emir-session-preference.dto";
import { UpdateEmirSessionPreferenceDto } from "../dtos/update-emir-session-preference.dto";

export class UpdateEmirSessionPreferenceUseCase {
  constructor(private readonly repo: IEmirSessionPreferenceRepository, private readonly service: EmirSessionPreferenceService) {}
  async execute(id: number, input: UpdateEmirSessionPreferenceDto): Promise<EmirSessionPreferenceDto | null> {
    const active = input.active === undefined ? undefined : this.service.validateActive(input.active);
    const result = await this.repo.update(id, active === undefined ? {} : { active });
    return result ? mapper.map(result, EmirSessionPreferenceEntity, EmirSessionPreferenceDto) : null;
  }
}
