import { mapper } from "../../../../infrastructure/mapping/mapper";
import { MembershipDto } from "../dtos/membership.dto";
import { MembershipEntity } from "../../domain/entities/membership-entity";
import { IMembershipRepository } from "../../domain/repositories/imembership-repository";

export class GetMembershipsUseCase {
  constructor(private readonly repo: IMembershipRepository) {}
  async execute(): Promise<MembershipDto[]> {
    return mapper.mapArray(await this.repo.findAll(), MembershipEntity, MembershipDto);
  }
}
