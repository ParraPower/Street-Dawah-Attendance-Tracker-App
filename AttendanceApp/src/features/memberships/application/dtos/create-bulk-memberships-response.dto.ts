import { MembershipDto } from "./membership.dto";

export class CreateBulkMembershipsResponseDto {
  createdMemberships!: MembershipDto[];
  omittedMemberships!: MembershipDto[];
}
