import { createMap, forMember, mapFrom } from '@automapper/core';
import { mapper } from '../../../../shared/infrastructure/mapping/mapper';
import { JwtKey } from '../../domain/entities/key-entity';
import { GeneratedKeyPairDTO } from '../dtos/generated-key-pair.dto';

export function createJwtKeyProfile() {
  createMap(
    mapper,
    JwtKey,
    GeneratedKeyPairDTO,
    forMember(
      (dest) => dest.kid,
      mapFrom((src) => src.kid.toString()),
    ),
    forMember(
      (dest) => dest.publicKey,
      mapFrom((src) => src.publicKey),
    ),
    forMember(
      (dest) => dest.privateKey,
      mapFrom((src) => src.privateKey),
    ),
    forMember(
      (dest) => dest.algorithm,
      mapFrom((src) => src.algorithm),
    )
  );
}

