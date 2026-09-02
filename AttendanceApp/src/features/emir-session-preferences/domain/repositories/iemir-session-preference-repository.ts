import { EmirSessionPreferenceEntity } from "../entities/emir-session-preference-entity";

export interface IEmirSessionPreferenceRepository {
  findById(id: number): Promise<EmirSessionPreferenceEntity | null>;
  findAll(): Promise<EmirSessionPreferenceEntity[]>;
  findByUserId(userId: number): Promise<EmirSessionPreferenceEntity[]>;
  findBySessionId(sessionId: number): Promise<EmirSessionPreferenceEntity[]>;
  findByUserAndSession(userId: number, sessionId: number, excludeId?: number): Promise<EmirSessionPreferenceEntity | null>;
  create(preference: Partial<EmirSessionPreferenceEntity>): Promise<EmirSessionPreferenceEntity>;
  update(id: number, preference: Partial<EmirSessionPreferenceEntity>): Promise<EmirSessionPreferenceEntity | null>;
  delete(id: number): Promise<boolean>;
}
