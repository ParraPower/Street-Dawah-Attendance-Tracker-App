export interface ISessionOccurrenceEntity {
  sessionId: number;
  occurrenceDate: string;
  NoOfShahadahs?: number | null;
  NoOfQuransDistributed?: number | null;
}