import { IMembershipRepository } from "../../domain/repositories/imembership-repository";

export class DeleteMembershipUseCase {
  constructor(private readonly repo: IMembershipRepository) {}
  execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}
