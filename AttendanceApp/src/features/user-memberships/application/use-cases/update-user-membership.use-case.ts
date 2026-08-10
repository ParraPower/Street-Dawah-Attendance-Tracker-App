import { mapper } from "../../../../infrastructure/mapping/mapper";
import { UpdateUserMembershipDto } from "../dtos/update-user-membership.dto";
import { UserMembershipDto } from "../dtos/user-membership.dto";
import { IUserMembershipRepository } from "../../domain/repositories/iuser-membership-repository";
import { UserMembershipService } from "../../domain/services/user-membership-service";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";

export class UpdateUserMembershipUseCase {
  constructor(private readonly repo: IUserMembershipRepository, private readonly service: UserMembershipService) {}
  async execute(id: number, input: UpdateUserMembershipDto): Promise<UserMembershipDto | null> {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    const active = this.service.validateActive(input.active);
    const entity = await this.repo.update(id, { ...input, ...(active === undefined ? {} : { active }) });
    return entity ? mapper.map(entity, UserMembershipEntity, UserMembershipDto) : null;
  }
}
