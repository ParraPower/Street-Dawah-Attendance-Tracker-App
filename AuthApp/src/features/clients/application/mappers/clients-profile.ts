import { mapper } from "@/mapping/mapper";
import { createMap } from "@automapper/core";
import { ClientEntity } from "../../domains/entities/client-entity";
import { ClientCredentialsResponseDto } from "../dtos/client-credentials-response.dto";

export function createClientProfile() {
  createMap(
    mapper,
    ClientEntity,
    ClientCredentialsResponseDto,
  );
}
