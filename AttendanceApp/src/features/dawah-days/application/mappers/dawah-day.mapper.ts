import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateDawahDayDto } from "../dtos/create-dawah-day.dto";
import { DawahDayDto } from "../dtos/dawah-day.dto";
import { DawahDayEntity } from "../../domain/entities/dawah-day-entity";

export function createDawahDayProfile() {
  createMap(mapper, CreateDawahDayDto, DawahDayEntity);
  createMap(mapper, DawahDayEntity, DawahDayDto);
}
