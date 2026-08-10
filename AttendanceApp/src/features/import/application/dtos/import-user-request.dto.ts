/**
 * DTO for importing rows from external files
 * Supports both user-only imports and full attendance record imports
 * Maps to the ImportRow entity structure
 */
export class ImportRowRequestDto {
  // User fields (for backward compatibility)
  //email?: string;
  //password?: string;

  // Full import row fields (from ImportRow entity)
  name?: string;
  reference?: string;
  joinedDate?: Date;
  lastAttendance?: Date;
  location?: string;
  regularLocation?: string;
  number!: string;
  whatsappLink?: string;
  lastAttendedBefore60Days?: string;
  status?: string;
    managementFeedbackrequiredtoremove?: string;
  outreachDate?: Date | null;
  whoReachedOut?: string;
  socials?: boolean | null;
  university?: boolean | null;
  outcome?: string;

  username?: string | undefined; // Optional username field for user creation
}

// Keep for bulk import requests
export class ImportUsersRequestDto {
  users!: ImportRowRequestDto[];
}

export class NormalizedImportUserRequestDto extends ImportRowRequestDto {
  normalizedNumber!: string;
}

// Alias for backward compatibility
export type ImportUserRequestDto = ImportRowRequestDto;
