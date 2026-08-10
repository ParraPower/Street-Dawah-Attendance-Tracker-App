import { mapper } from "../../../../infrastructure/mapping/mapper";
import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";
import { UserMembershipDto } from "../dtos/user-membership.dto";

export class GetUserMembershipUseCase {
  constructor(private readonly repo: IUserMembershipRepository) {}
  async execute(id: number): Promise<UserMembershipDto | null> {
    const entity = await this.repo.findById(id);
    return entity ? mapper.map(entity, UserMembershipEntity, UserMembershipDto) : null;
  }
}
