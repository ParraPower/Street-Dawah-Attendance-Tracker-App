import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";

export class DeleteUserMembershipUseCase {
  constructor(private readonly repo: IUserMembershipRepository) {}
  async execute(id: number): Promise<boolean> { return this.repo.delete(id); }
}
