export const createSessionOccurrenceExample = {
  summary: 'A typical create payload',
  value: {
    sessionId: 1,
    occurrenceDate: new Date().toISOString().split('T')[0],
    showPublicly: true,
    mainEmirUserId: null,
    NoOfShahadahs: 2,
    NoOfQuransDistributed: 10,
    createdBy: 1
  }
};
