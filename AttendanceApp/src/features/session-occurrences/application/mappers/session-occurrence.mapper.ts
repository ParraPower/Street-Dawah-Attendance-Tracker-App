import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateSessionOccurrenceDto } from "../dtos/create-session-occurrence.dto";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";

export function createSessionOccurrenceProfile() {
  createMap(mapper, CreateSessionOccurrenceDto, SessionOccurrenceEntity);
  createMap(mapper, SessionOccurrenceEntity, SessionOccurrenceDto);
}