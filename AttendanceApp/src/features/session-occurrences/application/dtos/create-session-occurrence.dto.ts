export class CreateSessionOccurrenceDto {
  sessionId!: number;
  occurrenceDate!: string;
  NoOfShahadahs?: number | null;
  NoOfQuransDistributed?: number | null;
  createdBy?: number;
}