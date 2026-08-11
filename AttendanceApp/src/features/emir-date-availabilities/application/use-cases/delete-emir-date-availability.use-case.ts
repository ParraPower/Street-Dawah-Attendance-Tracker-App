import { IEmirDateAvailabilityRepository } from "../../domain/repositories/iemir-date-availability-repository";

export class DeleteEmirDateAvailabilityUseCase {
  constructor(private readonly repo: IEmirDateAvailabilityRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}
