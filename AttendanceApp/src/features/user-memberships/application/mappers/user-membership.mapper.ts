import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateUserMembershipDto } from "../dtos/create-user-membership.dto";
import { UserMembershipDto } from "../dtos/user-membership.dto";
import { UserMembershipEntity } from "../../domain/entities/user-membership-entity";

export function createUserMembershipProfile() {
  createMap(mapper, CreateUserMembershipDto, UserMembershipEntity);
  createMap(mapper, UserMembershipEntity, UserMembershipDto);
}
