import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { ISessionAttendanceEntity } from "./interfaces/session-attendance-entity";

@Entity({ name: "session_attendances" })
@Index("IDX_session_attendances_user", ["userId"])
@Index("IDX_session_attendances_occurrence_user", ["sessionOccurrenceId", "userId"], {
  unique: true,
  where: '"isDeleted" IS NOT TRUE',
})
export class SessionAttendanceEntity extends BaseEntity implements ISessionAttendanceEntity {
  @Column({ type: "integer" })
  sessionOccurrenceId!: number;

  @Column({ type: "integer" })
  userId!: number;

  @Column({ type: "boolean", default: false })
  attended!: boolean;

  @Column({ type: "time", nullable: true })
  arrivalTime?: string | null;

  @Column({ type: "time", nullable: true })
  departureTime?: string | null;
}
