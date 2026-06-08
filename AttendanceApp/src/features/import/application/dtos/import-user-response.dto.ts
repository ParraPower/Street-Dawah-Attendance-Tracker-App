export class ImportUserResponseDto {
  success!: boolean;
  username!: string;
  name?: string;
  number?: string;
  whatsappLink?: string;
  joinedDate?: Date;
  reference?: string;
  lastAttendance?: Date;
  lastAttendedBefore60Days?: string;
  location?: string;
  regularLocation?: string;
  status?: string;
  outreachDate?: Date | null;
  whoReachedOut?: string;
  socials?: boolean | null;
  university?: boolean | null;
  outcome?: string;
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
