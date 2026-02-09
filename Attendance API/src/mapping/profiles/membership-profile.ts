import { createMap, forMember, mapFrom } from "@automapper/core";
import { ImportGroupRow } from "@/domains/import/entities/import-group-row";
import { Membership } from "@/domains/membership/entities/membership";
import { mapImportGroupTypeToMembershipType } from "@/domains/membership/helpers/mapImportGroupTypeToMembershipType.js";
import { mapper } from "../mapper";

export function createMembershipProfile() {
  createMap(
    mapper,
    ImportGroupRow,
    Membership,
    forMember(
      (destination) => destination.membershipTypesFlag,
      mapFrom((src) => mapImportGroupTypeToMembershipType(src.Type))
    ),
    forMember((destination) => destination.name, mapFrom((src) => src.Name)),
    forMember((destination) => destination.id, mapFrom((src) => src.id)),
    forMember((destination) => destination.createdAt, mapFrom((src) => src.createdAt)),
    forMember((destination) => destination.createdBy, mapFrom((src) => src.createdBy)),
    forMember((destination) => destination.updatedAt, mapFrom((src) => src.updatedAt)),
    forMember((destination) => destination.updatedBy, mapFrom((src) => src.updatedBy)),
    forMember((destination) => destination.isDeleted, mapFrom((src) => src.isDeleted))
  );
}