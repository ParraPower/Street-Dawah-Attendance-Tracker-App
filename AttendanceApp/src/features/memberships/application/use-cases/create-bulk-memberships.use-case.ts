import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateMembershipDto } from "../dtos/create-membership.dto";
import { CreateBulkMembershipsResponseDto } from "../dtos/create-bulk-memberships-response.dto";
import { MembershipDto } from "../dtos/membership.dto";
import { MembershipEntity } from "../../domain/entities/membership-entity";
import { IMembershipRepository } from "../../domain/repositories/imembership-repository";
import { MembershipService } from "../../domain/services/membership-service";

export class CreateBulkMembershipsUseCase {
  constructor(private readonly repo: IMembershipRepository, private readonly service: MembershipService) {}
  async execute(inputs: CreateMembershipDto[]): Promise<CreateBulkMembershipsResponseDto> {
    const existing = await this.repo.findAll();
    const names = new Set(existing.filter((item) => this.service.isActive(item)).map((item) => item.name));
    const omittedMemberships: MembershipDto[] = [];
    const entities: MembershipEntity[] = [];
    for (const input of inputs) {
      const name = this.service.normalizeName(input.name || "");
      if (!name || names.has(name)) continue;
      const membershipTypesFlag = this.service.validateTypesFlag(input.membershipTypesFlag ?? 0);
      names.add(name);
      entities.push({ ...input, name, membershipTypesFlag } as MembershipEntity);
    }
    const created = await this.repo.createBulk(entities);
    return { createdMemberships: mapper.mapArray(created, MembershipEntity, MembershipDto), omittedMemberships };
  }
}
