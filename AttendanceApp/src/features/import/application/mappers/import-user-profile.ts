import { createMap, forMember, mapFrom } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { ImportRowRequestDto, NormalizedImportUserRequestDto } from "../dtos/import-user-request.dto";
import { CreateUserDto } from "../../../users/application/dtos/create-user.dto";

export function createImportUserProfile() {
  createMap(
    mapper,
    ImportRowRequestDto,
    CreateUserDto,
    forMember(
      (destination) => destination.mobile,
      mapFrom((source) => source.number)
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => source.name)
    ),
  );

    createMap(
    mapper,
    NormalizedImportUserRequestDto,
    CreateUserDto,
    forMember(
      (destination) => destination.mobile,
      mapFrom((source) => source.number)
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => source.name)
    ),
    forMember(
      (destination) => destination.authUserId,
      mapFrom((source) => source.authUserId)
    ),
  );
}
