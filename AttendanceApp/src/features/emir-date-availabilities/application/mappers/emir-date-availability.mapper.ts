import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateEmirDateAvailabilityDto } from "../dtos/create-emir-date-availability.dto";
import { EmirDateAvailabilityDto } from "../dtos/emir-date-availability.dto";
import { EmirDateAvailabilityEntity } from "../../domain/entities/emir-date-availability-entity";

export function createEmirDateAvailabilityProfile() {
  createMap(mapper, CreateEmirDateAvailabilityDto, EmirDateAvailabilityEntity);
  createMap(mapper, EmirDateAvailabilityEntity, EmirDateAvailabilityDto);
}
