export class MembershipDto {
  id!: number;
  name!: string;
  membershipTypesFlag!: number;
  code!: string;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}
