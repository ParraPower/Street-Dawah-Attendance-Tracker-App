export class ImportUserResponseDto {
  success!: boolean;
  username!: string;
  number!: string;
  normalizedNumber?: string;
  authUserId?: string;
  id?: number;
  email?: string;
  scopes?: string[];
  error?: string;
  createdAt?: Date;
}

export class ImportUsersBulkResponseDto {
  createdUsers!: ImportUserResponseDto[];
  omittedUsers!: ImportUserResponseDto[];
  errors?: string[];
  summary?: {
    total: number;
    created: number;
    omitted: number;
    failed: number;
  };
}
