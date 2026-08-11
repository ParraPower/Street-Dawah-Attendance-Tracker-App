import { IEmirSessionPreferenceRepository } from "../../domain/repositories/iemir-session-preference-repository";

export class DeleteEmirSessionPreferenceUseCase {
  constructor(private readonly repo: IEmirSessionPreferenceRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}
