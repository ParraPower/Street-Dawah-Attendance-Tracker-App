import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateSessionAttendanceDto } from "../dtos/create-session-attendance.dto";
import { SessionAttendanceDto } from "../dtos/session-attendance.dto";
import { SessionAttendanceEntity } from "../../domain/entities/session-attendance-entity";

export function createSessionAttendanceProfile() {
  createMap(mapper, CreateSessionAttendanceDto, SessionAttendanceEntity);
  createMap(mapper, SessionAttendanceEntity, SessionAttendanceDto);
}
