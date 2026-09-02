export class EmirSessionPreferenceDto {
  id!: number;
  userId!: number;
  sessionId!: number;
  active!: boolean;
  createdAt!: Date;
  updatedAt?: Date;
}
