import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateEmirSessionPreferenceDto } from "../dtos/create-emir-session-preference.dto";
import { EmirSessionPreferenceDto } from "../dtos/emir-session-preference.dto";
import { EmirSessionPreferenceEntity } from "../../domain/entities/emir-session-preference-entity";
import { IEmirSessionPreferenceRepository } from "../../domain/repositories/iemir-session-preference-repository";
import { EmirSessionPreferenceService } from "../../domain/services/emir-session-preference-service";

export class CreateEmirSessionPreferenceUseCase {
  constructor(private readonly repo: IEmirSessionPreferenceRepository, private readonly service: EmirSessionPreferenceService) {}

  async execute(input: CreateEmirSessionPreferenceDto): Promise<EmirSessionPreferenceDto> {
    const userId = this.service.validateUserId(input.userId);
    const sessionId = this.service.validateSessionId(input.sessionId);
    if (await this.repo.findByUserAndSession(userId, sessionId)) throw new Error("Emir session preference already exists");
    const preference = await this.repo.create({ userId, sessionId, active: true });
    return mapper.map(preference, EmirSessionPreferenceEntity, EmirSessionPreferenceDto);
  }
}
