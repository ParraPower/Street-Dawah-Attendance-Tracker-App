import { ILocationRepository } from "../../domain/repositories/ilocation-repository";

export class DeleteLocationUseCase {
  constructor(private readonly repo: ILocationRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}