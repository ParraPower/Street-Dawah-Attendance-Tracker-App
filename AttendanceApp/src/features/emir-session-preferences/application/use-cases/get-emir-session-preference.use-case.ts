import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirSessionPreferenceEntity } from "../../domain/entities/emir-session-preference-entity";
import { IEmirSessionPreferenceRepository } from "../../domain/repositories/iemir-session-preference-repository";
import { EmirSessionPreferenceDto } from "../dtos/emir-session-preference.dto";

export class GetEmirSessionPreferenceUseCase {
  constructor(private readonly repo: IEmirSessionPreferenceRepository) {}
  async execute(id: number): Promise<EmirSessionPreferenceDto | null> {
    const result = await this.repo.findById(id);
    return result ? mapper.map(result, EmirSessionPreferenceEntity, EmirSessionPreferenceDto) : null;
  }
}
