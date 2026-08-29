import { createMap, forMember, mapFrom } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserDto } from "../dtos/user.dto";
import { UserEntity } from "../../domain/entities/user-entity";

export function createUserProfile() {
  createMap(mapper, CreateUserDto, UserEntity, 
    forMember(
      (destination) => destination.mobile,
      mapFrom((source) => source.mobile)
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => source.name) 
    ),
    forMember(
      (destination) => destination.shirtSize,
      mapFrom((source) => source.shirtSize)
    ),
    forMember(
      (destination) => destination.currentSuburb,
      mapFrom((source) => source.currentSuburb)
    ),
    forMember(
      (destination) => destination.authUserId,
      mapFrom((source) => source.authUserId)
    )
  );
  createMap(mapper, UserEntity, UserDto);
}
