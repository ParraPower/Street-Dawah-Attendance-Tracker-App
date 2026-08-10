export class SessionOccurrenceDto {
  id!: number;
  sessionId!: number;
  occurrenceDate!: string;
  showPublicly?: boolean | null;
  mainEmirUserId?: number | null;
  NoOfShahadahs?: number | null;
  NoOfQuransDistributed?: number | null;
  isDeleted?: boolean | null;
  createdAt!: Date;
  updatedAt?: Date;
}