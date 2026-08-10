import { mapper } from "../../../../infrastructure/mapping/mapper";
import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";
import { UserMembershipDto } from "../dtos/user-membership.dto";

export class GetUsersByMembershipUseCase {
  constructor(private readonly repo: IUserMembershipRepository) {}
  async execute(membershipId: number): Promise<UserMembershipDto[]> {
    return (await this.repo.findByMembershipId(membershipId)).map((entity) => mapper.map(entity, UserMembershipEntity, UserMembershipDto));
  }
}
