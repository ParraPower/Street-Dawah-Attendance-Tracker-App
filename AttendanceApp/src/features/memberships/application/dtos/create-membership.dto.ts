export class CreateMembershipDto {
  name!: string;
  membershipTypesFlag!: number;
  code?: string;
  createdBy?: number;
}
