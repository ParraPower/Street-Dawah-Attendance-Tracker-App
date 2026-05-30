export class ImportUserResponseDto {
  success!: boolean;
  userId?: number;
  email?: string;
  username!: string;
  error?: string;
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
