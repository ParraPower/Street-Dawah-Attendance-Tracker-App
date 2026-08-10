import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateUserMembershipDto } from "../dtos/create-user-membership.dto";
import { UserMembershipDto } from "../dtos/user-membership.dto";
import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";
import { UserMembershipService } from "../../domain/services/user-membership-service";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";

export class CreateUserMembershipUseCase {
  constructor(private readonly repo: IUserMembershipRepository, private readonly service: UserMembershipService) {}

  async execute(input: CreateUserMembershipDto): Promise<UserMembershipDto> {
    const userId = this.service.validateId(input.userId, "userId");
    const membershipId = this.service.validateId(input.membershipId, "membershipId");
    const active = this.service.validateActive(input.active) ?? true;
    if (await this.repo.findByUserAndMembership(userId, membershipId)) throw new Error("User membership already exists");
    const entity = await this.repo.create({ ...input, userId, membershipId, active });
    return mapper.map(entity, UserMembershipEntity, UserMembershipDto);
  }
}
