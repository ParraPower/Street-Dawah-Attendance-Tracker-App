import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateLocationDto } from "../dtos/create-location.dto";
import { LocationDto } from "../dtos/location.dto";
import { LocationEntity } from "../../domain/entities/location-entity";

export function createLocationProfile() {
  createMap(mapper, CreateLocationDto, LocationEntity);
  createMap(mapper, LocationEntity, LocationDto);
}