import { ISessionRepository } from "../../domain/repositories/isession-repository";

export class DeleteSessionUseCase {
  constructor(private readonly repo: ISessionRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}
