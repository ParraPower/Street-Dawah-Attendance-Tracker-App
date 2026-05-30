/**
 * DTO for importing rows from external files
 * Supports both user-only imports and full attendance record imports
 * Maps to the ImportRow entity structure
 */
export class ImportRowRequestDto {
  // User fields (for backward compatibility)
  email?: string;
  username!: string;
  password?: string;

  // Full import row fields (from ImportRow entity)
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
  outreachDate?: string;
  whoReachedOut?: string;
  socials?: boolean | null;
  university?: boolean | null;
  outcome?: string;
}

// Keep for bulk import requests
export class ImportUsersRequestDto {
  users!: ImportRowRequestDto[];
}

// Alias for backward compatibility
export type ImportUserRequestDto = ImportRowRequestDto;
