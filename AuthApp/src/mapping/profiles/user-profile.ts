import { createMap, forMember, mapFrom } from '@automapper/core';
import { mapper } from '../mapper';
import { UserEntity } from '../../domains/users/user-entity';
import { UserDto } from '../../dtos/user/user.dto';
import { CreateUserDto } from '@/dtos/user/create-user.dto';
import { getScopeesFromUserEntity } from '@/dtos/user/user.helper';
import { RegisterUserResponseDto } from '@/modules/auth/dto/register-user.dto';

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

  // If you want to map UserEntity to RegisterUserDto, you can create another map
  createMap(
    mapper,
    UserEntity,
    RegisterUserResponseDto,
    forMember(
      (dest) => dest.email,
      mapFrom((src) => src.email),
    ),
    forMember(
      (dest) => dest.username,
      mapFrom((src) => src.username),
    ),
    forMember(
      (dest) => dest.registeredAt,
      mapFrom((src) => src.createdAt), // Set to current date/time to indicate registration
    ),
  );
}

