import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";

export class DeleteSessionOccurrenceUseCase {
  constructor(private readonly repo: ISessionOccurrenceRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}