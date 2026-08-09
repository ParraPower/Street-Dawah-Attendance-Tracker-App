export class UserMembershipService {
  validateId(value: number, fieldName: string): number {
    if (!Number.isInteger(value) || value <= 0) throw new Error(`A valid ${fieldName} is required`);
    return value;
  }

  validateActive(value: boolean | undefined): boolean | undefined {
    if (value !== undefined && typeof value !== "boolean") throw new Error("active must be a boolean");
    return value;
  }
}
