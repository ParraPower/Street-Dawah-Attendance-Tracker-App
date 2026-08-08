import { LocationDto } from "./location.dto";

export class CreateBulkLocationsResponseDto {
  createdLocations!: LocationDto[];
  omittedLocations!: LocationDto[];
}