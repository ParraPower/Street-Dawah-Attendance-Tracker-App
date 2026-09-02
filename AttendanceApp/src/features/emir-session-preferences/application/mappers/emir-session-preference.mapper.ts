import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateEmirSessionPreferenceDto } from "../dtos/create-emir-session-preference.dto";
import { EmirSessionPreferenceDto } from "../dtos/emir-session-preference.dto";
import { EmirSessionPreferenceEntity } from "../../domain/entities/emir-session-preference-entity";

export function createEmirSessionPreferenceProfile() {
  createMap(mapper, CreateEmirSessionPreferenceDto, EmirSessionPreferenceEntity);
  createMap(mapper, EmirSessionPreferenceEntity, EmirSessionPreferenceDto);
}
