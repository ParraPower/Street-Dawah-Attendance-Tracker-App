export class CreateUserMembershipDto {
  userId!: number;
  membershipId!: number;
  active?: boolean;
  createdBy?: number;
}
