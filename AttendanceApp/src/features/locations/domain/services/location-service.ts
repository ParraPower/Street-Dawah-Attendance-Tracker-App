import { LocationEntity } from "../entities/location-entity";

export class LocationService {
  normalizeName(value: string): string { return value.trim().replace(/\s+/g, " "); }
  normalizePostcode(value: string): string { return value.trim().toUpperCase().replace(/\s+/g, " "); }
  isActive(location: LocationEntity): boolean { return !location.isDeleted; }
}