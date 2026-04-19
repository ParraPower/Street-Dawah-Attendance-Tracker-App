import { IClientRepository } from "../../domains/repositories/iclient-repo";

export class DeleteClientCredentialsUseCase {
  constructor(
    private readonly repo: IClientRepository,
  ) {}
  async execute(id: number): Promise<boolean> {
    return await this.repo.delete(id);
  }
}