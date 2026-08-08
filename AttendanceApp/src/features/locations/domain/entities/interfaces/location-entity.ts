export interface ILocationEntity {
  id: number;
  name: string;
  postcode: string;
  isDeleted?: boolean | null;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}