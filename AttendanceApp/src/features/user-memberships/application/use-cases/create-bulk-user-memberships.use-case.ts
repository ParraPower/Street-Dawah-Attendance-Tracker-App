import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateUserMembershipDto } from "../dtos/create-user-membership.dto";
import { UserMembershipDto } from "../dtos/user-membership.dto";
import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";
import { UserMembershipService } from "../../domain/services/user-membership-service";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";

export class CreateBulkUserMembershipsUseCase {
  constructor(private readonly repo: IUserMembershipRepository, private readonly service: UserMembershipService) {}

  async execute(input: CreateUserMembershipDto[]): Promise<UserMembershipDto[]> {
    if (!Array.isArray(input) || input.length === 0) throw new Error("At least one user membership is required");
    const seen = new Set<string>();
    const values = input.map((item) => {
      const userId = this.service.validateId(item.userId, "userId");
      const membershipId = this.service.validateId(item.membershipId, "membershipId");
      const key = `${userId}:${membershipId}`;
      if (seen.has(key)) throw new Error("Duplicate user membership in request");
      seen.add(key);
      const active = this.service.validateActive(item.active) ?? true;
      return { ...item, userId, membershipId, active };
    });
    for (const value of values) {
      if (await this.repo.findByUserAndMembership(value.userId, value.membershipId)) throw new Error("User membership already exists");
    }
    return (await this.repo.createBulk(values)).map((entity) => mapper.map(entity, UserMembershipEntity, UserMembershipDto));
  }
}
