export class LocationDto {
  id!: number;
  name!: string;
  postcode!: string;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}