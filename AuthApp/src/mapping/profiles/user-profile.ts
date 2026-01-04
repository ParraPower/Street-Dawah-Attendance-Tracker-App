import { createMap, forMember, mapFrom } from '@automapper/core';
import { mapper } from '../mapper';
import { UserEntity } from '../../domains/users/user-entity';
import { UserDto } from '../../dtos/user/user.dto';
import { CreateUserDto } from '@/dtos/user/create-user.dto';

export function createUserProfile() {
  createMap(
    mapper,
    UserEntity,
    UserDto,
    forMember(
      (dest) => dest.scopes,
      mapFrom((src) => src.scopes || []),
    ),
  );

  createMap(
    mapper,
    CreateUserDto,
    UserEntity,
  );
}

