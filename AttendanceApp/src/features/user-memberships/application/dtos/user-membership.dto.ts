export class UserMembershipDto {
  id!: number;
  userId!: number;
  membershipId!: number;
  active!: boolean;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}
