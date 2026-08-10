import { mapper } from "../../../../infrastructure/mapping/mapper";
import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";
import { UserMembershipDto } from "../dtos/user-membership.dto";

export class GetMembershipsByUserUseCase {
  constructor(private readonly repo: IUserMembershipRepository) {}
  async execute(userId: number): Promise<UserMembershipDto[]> {
    return (await this.repo.findByUserId(userId)).map((entity) => mapper.map(entity, UserMembershipEntity, UserMembershipDto));
  }
}
