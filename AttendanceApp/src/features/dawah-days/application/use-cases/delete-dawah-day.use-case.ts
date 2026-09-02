import { IDawahDayRepository } from "../../domain/repositories/idawah-day-repository";

export class DeleteDawahDayUseCase {
  constructor(private readonly repo: IDawahDayRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}
