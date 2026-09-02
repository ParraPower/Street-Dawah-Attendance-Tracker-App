import { mapper } from "../../../../infrastructure/mapping/mapper";
import { UpdateMembershipDto } from "../dtos/update-membership.dto";
import { MembershipDto } from "../dtos/membership.dto";
import { MembershipEntity } from "../../domain/entities/membership-entity";
import { IMembershipRepository } from "../../domain/repositories/imembership-repository";
import { MembershipService } from "../../domain/services/membership-service";

export class UpdateMembershipUseCase {
  constructor(private readonly repo: IMembershipRepository, private readonly service: MembershipService) {}
  async execute(id: number, input: UpdateMembershipDto): Promise<MembershipDto | null> {
    const update: Partial<MembershipEntity> = { ...input };
    if (input.name !== undefined) {
      update.name = this.service.normalizeName(input.name);
      if (!update.name) throw new Error("Membership name cannot be empty");
      const duplicate = await this.repo.findByName(update.name);
      if (duplicate && duplicate.id !== id) throw new Error("Membership already exists");
    }
    if (input.membershipTypesFlag !== undefined) update.membershipTypesFlag = this.service.validateTypesFlag(input.membershipTypesFlag);
    if (input.code !== undefined) update.code = this.service.validateCode(input.code);
    const membership = await this.repo.update(id, update);
    return membership ? mapper.map(membership, MembershipEntity, MembershipDto) : null;
  }
}
