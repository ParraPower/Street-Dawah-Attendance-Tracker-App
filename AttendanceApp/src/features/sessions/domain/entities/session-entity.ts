import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { ISessionEntity } from "./interfaces/session-entity";
import { DayOfWeekEnum } from "../enums/day-of-week-enum";

@Entity({ name: "sessions" })
@Index(["locationId", "dayOfWeek"])
export class SessionEntity extends BaseEntity implements ISessionEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "integer" })
  locationId!: number;

  @Column({ type: "smallint" })
  dayOfWeek!: DayOfWeekEnum;

  @Column({ type: "time" })
  startTime!: string;

  @Column({ type: "time" })
  endTime!: string;
}
