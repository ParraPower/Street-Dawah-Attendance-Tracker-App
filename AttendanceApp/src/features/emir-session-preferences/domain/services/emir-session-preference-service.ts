export class EmirSessionPreferenceService {
  validateUserId(userId: number): number {
    if (!Number.isInteger(userId) || userId <= 0) throw new Error("userId must be a positive integer");
    return userId;
  }

  validateSessionId(sessionId: number): number {
    if (!Number.isInteger(sessionId) || sessionId <= 0) throw new Error("sessionId must be a positive integer");
    return sessionId;
  }

  validateActive(active: boolean): boolean {
    if (typeof active !== "boolean") throw new Error("active must be a boolean");
    return active;
  }
}
