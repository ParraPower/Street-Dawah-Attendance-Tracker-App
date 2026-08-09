import { createMap, forMember, mapFrom } from '@automapper/core';
import { mapper } from '../../../../shared/infrastructure/mapping/mapper';
import { UserEntity } from '../../domain/entities/user-entity';
import { RegisterUserResponseDto } from '@auth/features/auth/application/dtos/register-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { ScopeList, Scopes } from '@auth/features/auth/domain/policies/scope-types';
import { CreateBulkUsersResponseOmittedUserDto } from '../dtos/create-bulk-users-response.dto'

const getScopeesFromUserEntity = (user: UserEntity): ScopeList => {
  const response = user?.scopes.map(scope =>
    Object.values(Scopes).includes(scope as Scopes)
      ? (scope as Scopes)
      : undefined
  ) ?? [];

  return response as ScopeList;
}

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
    forMember(
      (dest) => dest.email,
      mapFrom((src) => src.email)
    ),
    forMember(
      (dest) => dest.username,
      mapFrom((src) => src.username)
    ),
    forMember(
      (dest) => dest.scopes,
      mapFrom((src) => src.scopes)
    )
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

  createMap(
    mapper,
    UserDto,
    CreateBulkUsersResponseOmittedUserDto,
    forMember(
      (dest) => dest.id,
      mapFrom((src) => src.id), // Assuming UserDto.id is already a string
    ),
    forMember(
      (dest) => dest.email,
      mapFrom((src) => src.email)
    ),
    forMember(
      (dest) => dest.username,
      mapFrom((src) => src.username)
    ),
    forMember(
      (dest) => dest.createdAt,
      mapFrom((src) => src.createdAt)
    ),
    forMember(
      (dest) => dest.scopes,
      mapFrom((src) => src.scopes)
    )
  );

  createMap(
    mapper,
    UserEntity,
    CreateBulkUsersResponseOmittedUserDto,
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

}

