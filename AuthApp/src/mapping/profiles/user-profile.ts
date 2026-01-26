import { createMap, forMember, mapFrom } from '@automapper/core';
import { mapper } from '../mapper';
import { UserEntity } from '../../domains/users/user-entity';
import { UserDto } from '../../dtos/user/user.dto';
import { CreateUserDto } from '@/dtos/user/create-user.dto';
import { getScopeesFromUserEntity } from '@/dtos/user/user.helper';

export function createUserProfile() {
  createMap(
    mapper,
    UserEntity,
    UserDto,
    forMember(
      (dest) => dest.id,
      mapFrom((src) => src.id.toString()),
    ),
    forMember(
      (dest) => dest.email,
      mapFrom((src) => src.email),
    ),
    forMember(
      (dest) => dest.username,
      mapFrom((src) => src.username),
    ),
    forMember(
      (dest) => dest.createdAt,
      mapFrom((src) => src.createdAt),
    ),
    forMember(
      (dest) => dest.scopes,
      mapFrom((src) => getScopeesFromUserEntity(src)),
    ),
  );

  createMap(
    mapper,
    CreateUserDto,
    UserEntity,
  );
}

