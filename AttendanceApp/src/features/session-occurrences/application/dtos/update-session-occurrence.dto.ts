export class UpdateSessionOccurrenceDto {
  sessionId?: number;
  occurrenceDate?: string;
  NoOfShahadahs?: number | null;
  NoOfQuransDistributed?: number | null;
  updatedBy?: number;
}