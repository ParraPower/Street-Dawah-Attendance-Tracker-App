import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateMembershipDto } from "../dtos/create-membership.dto";
import { MembershipDto } from "../dtos/membership.dto";
import { MembershipEntity } from "../../domain/entities/membership-entity";
import { IMembershipRepository } from "../../domain/repositories/imembership-repository";
import { MembershipService } from "../../domain/services/membership-service";

export class CreateMembershipUseCase {
  constructor(private readonly repo: IMembershipRepository, private readonly service: MembershipService) {}
  async execute(input: CreateMembershipDto): Promise<MembershipDto> {
    const name = this.service.normalizeName(input.name || "");
    if (!name) throw new Error("Membership name is required");
    const membershipTypesFlag = this.service.validateTypesFlag(input.membershipTypesFlag ?? 0);
    if (await this.repo.findByName(name)) throw new Error("Membership already exists");
    return mapper.map(await this.repo.create({ ...input, name, membershipTypesFlag }), MembershipEntity, MembershipDto);
  }
}
