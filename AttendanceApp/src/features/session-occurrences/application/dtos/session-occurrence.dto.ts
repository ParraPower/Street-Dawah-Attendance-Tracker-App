export class SessionOccurrenceDto {
  id!: number;
  sessionId!: number;
  occurrenceDate!: string;
  NoOfShahadahs?: number | null;
  NoOfQuransDistributed?: number | null;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}