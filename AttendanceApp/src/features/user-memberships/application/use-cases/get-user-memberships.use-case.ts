import { mapper } from "../../../../infrastructure/mapping/mapper";
import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";
import { UserMembershipDto } from "../dtos/user-membership.dto";

export class GetUserMembershipsUseCase {
  constructor(private readonly repo: IUserMembershipRepository) {}
  async execute(): Promise<UserMembershipDto[]> {
    return (await this.repo.findAll()).map((entity) => mapper.map(entity, UserMembershipEntity, UserMembershipDto));
  }
}
