import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateSessionDto } from "../dtos/create-session.dto";
import { SessionDto } from "../dtos/session.dto";
import { SessionEntity } from "../../domain/entities/session-entity";

export function createSessionProfile() {
  createMap(mapper, CreateSessionDto, SessionEntity);
  createMap(mapper, SessionEntity, SessionDto);
}
