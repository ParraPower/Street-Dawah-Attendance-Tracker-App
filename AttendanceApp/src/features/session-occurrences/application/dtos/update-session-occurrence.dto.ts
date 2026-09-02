export class UpdateSessionOccurrenceDto {
  sessionId?: number;
  occurrenceDate?: string;
  showPublicly?: boolean | null;
  mainEmirUserId?: number | null;
  NoOfShahadahs?: number | null;
  NoOfQuransDistributed?: number | null;
  updatedBy?: number;
}