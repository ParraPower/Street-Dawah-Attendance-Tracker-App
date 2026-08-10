import { createMap } from "@automapper/core";
import { mapper } from "../../../../infrastructure/mapping/mapper";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserDto } from "../dtos/user.dto";
import { UserEntity } from "../../domain/entities/user-entity";

export function createUserProfile() {
  createMap(mapper, CreateUserDto, UserEntity);
  createMap(mapper, UserEntity, UserDto);
}
