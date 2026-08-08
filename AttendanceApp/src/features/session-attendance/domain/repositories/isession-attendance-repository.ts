import { SessionAttendanceEntity } from "../entities/session-attendance-entity";

export interface ISessionAttendanceRepository {
  findById(id: number): Promise<SessionAttendanceEntity | null>;
  findAll(): Promise<SessionAttendanceEntity[]>;
  findByUserId(userId: number): Promise<SessionAttendanceEntity[]>;
  findBySessionOccurrenceId(sessionOccurrenceId: number): Promise<SessionAttendanceEntity[]>;
  findBySessionOccurrenceAndUser(sessionOccurrenceId: number, userId: number, excludeId?: number): Promise<SessionAttendanceEntity | null>;
  create(attendance: Partial<SessionAttendanceEntity>): Promise<SessionAttendanceEntity>;
  update(id: number, attendance: Partial<SessionAttendanceEntity>): Promise<SessionAttendanceEntity | null>;
  delete(id: number): Promise<boolean>;
  createBulk(attendances: Partial<SessionAttendanceEntity>[]): Promise<SessionAttendanceEntity[]>;
}
