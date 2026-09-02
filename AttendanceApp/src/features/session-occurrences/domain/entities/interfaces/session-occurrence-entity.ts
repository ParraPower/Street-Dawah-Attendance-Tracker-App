export interface ISessionOccurrenceEntity {
  sessionId: number;
  occurrenceDate: string;
  showPublicly?: boolean | null;
  mainEmirUserId?: number | null;
  NoOfShahadahs?: number | null;
  NoOfQuransDistributed?: number | null;
}