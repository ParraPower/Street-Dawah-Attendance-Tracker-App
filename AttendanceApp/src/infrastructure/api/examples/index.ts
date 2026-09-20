export * from './create-session-occurrence.example';

export const examplesMap: Record<string, any> = {
  CreateSessionOccurrenceDto: { // reference name of DTO class
    'default': {
      summary: 'Default create session occurrence',
      value: {
        sessionId: 1,
        occurrenceDate: '2026-01-01',
        showPublicly: true,
        mainEmirUserId: null,
        NoOfShahadahs: 0,
        NoOfQuransDistributed: 0,
        createdBy: 1
      }
    }
  }
};
