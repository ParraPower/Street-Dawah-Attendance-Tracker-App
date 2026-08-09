import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateMembershipDto } from "../dtos/create-membership.dto";
import { MembershipDto } from "../dtos/membership.dto";
import { MembershipEntity } from "../../domain/entities/membership-entity";

export function createMembershipMapper() {
  createMap(mapper, CreateMembershipDto, MembershipEntity);
  createMap(mapper, MembershipEntity, MembershipDto);
}
