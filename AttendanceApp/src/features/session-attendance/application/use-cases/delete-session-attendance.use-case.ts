import { ISessionAttendanceRepository } from "../../domain/repositories/isession-attendance-repository";

export class DeleteSessionAttendanceUseCase {
  constructor(private readonly repo: ISessionAttendanceRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}
