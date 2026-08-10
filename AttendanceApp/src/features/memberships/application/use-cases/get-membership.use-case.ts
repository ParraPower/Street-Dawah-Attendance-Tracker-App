import { mapper } from "../../../../infrastructure/mapping/mapper";
import { MembershipDto } from "../dtos/membership.dto";
import { MembershipEntity } from "../../domain/entities/membership-entity";
import { IMembershipRepository } from "../../domain/repositories/imembership-repository";

export class GetMembershipUseCase {
  constructor(private readonly repo: IMembershipRepository) {}
  async execute(id: number): Promise<MembershipDto | null> {
    const membership = await this.repo.findById(id);
    return membership ? mapper.map(membership, MembershipEntity, MembershipDto) : null;
  }
}
