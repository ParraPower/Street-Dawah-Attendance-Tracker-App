export class MembershipDto {
  id!: number;
  name!: string;
  membershipTypesFlag!: number;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}
