import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { ISessionOccurrenceEntity } from "./interfaces/session-occurrence-entity";

@Entity({ name: "session_occurrences" })
@Index(["sessionId", "occurrenceDate"])
export class SessionOccurrenceEntity extends BaseEntity implements ISessionOccurrenceEntity {
  @Column({ type: "integer" })
  sessionId!: number;

  @Column({ type: "date" })
  occurrenceDate!: string;

  @Column({ type: "integer", nullable: true })
  NoOfShahadahs?: number | null;

  @Column({ type: "integer", nullable: true })
  NoOfQuransDistributed?: number | null;
}