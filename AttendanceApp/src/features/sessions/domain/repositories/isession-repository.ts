import { SessionEntity } from "../entities/session-entity";
import { DayOfWeekEnum } from "../enums/day-of-week-enum";

export interface ISessionRepository {
  findById(id: number): Promise<SessionEntity | null>;
  findAll(): Promise<SessionEntity[]>;
  findBySchedule(locationId: number, dayOfWeek: DayOfWeekEnum, startTime: string, endTime: string, excludeId?: number): Promise<SessionEntity | null>;
  hasOverlap(locationId: number, dayOfWeek: DayOfWeekEnum, startTime: string, endTime: string, excludeId?: number): Promise<boolean>;
  create(session: Partial<SessionEntity>): Promise<SessionEntity>;
  update(id: number, session: Partial<SessionEntity>): Promise<SessionEntity | null>;
  delete(id: number): Promise<boolean>;
}
