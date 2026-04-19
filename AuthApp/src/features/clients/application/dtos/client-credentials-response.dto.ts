export class ClientCredentialsResponseDto {
  id!: number;
  name!: string;
  scopes!: string[];
  createdAt!: Date;
  updatedAt?: Date;
}
