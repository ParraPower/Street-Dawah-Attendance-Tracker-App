import { mapper } from "../../../../infrastructure/mapping/mapper";
import { EmirSessionPreferenceEntity } from "../../domain/entities/emir-session-preference-entity";
import { IEmirSessionPreferenceRepository } from "../../domain/repositories/iemir-session-preference-repository";
import { EmirSessionPreferenceDto } from "../dtos/emir-session-preference.dto";

export class GetEmirSessionPreferencesBySessionUseCase {
  constructor(private readonly repo: IEmirSessionPreferenceRepository) {}
  async execute(sessionId: number): Promise<EmirSessionPreferenceDto[]> {
    return (await this.repo.findBySessionId(sessionId)).map((item) => mapper.map(item, EmirSessionPreferenceEntity, EmirSessionPreferenceDto));
  }
}
