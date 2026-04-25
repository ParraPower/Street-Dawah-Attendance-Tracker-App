import { mapper } from "@auth/shared/infrastructure/mapping/mapper";
import { IJwtKeyRepository } from "../../domain/repositories/ijwtkey-repository";
import { IAuthAppJwtService } from "../../domain/services/jwt-service";
import { GeneratedKeyPairDTO } from "../dtos/generated-key-pair.dto";
import { JwtKey } from "../../domain/entities/key-entity";

export class GenerateActiveKeyPairUseCase {
  constructor(
    private readonly jwtService: IAuthAppJwtService,
    private readonly jwtKeyRepo: IJwtKeyRepository
  ) {}

  execute = async (): Promise<GeneratedKeyPairDTO> => {
    const existing = await this.jwtKeyRepo.findActiveKey();
    if (existing)
      return mapper.map(existing, JwtKey, GeneratedKeyPairDTO)

    const { kid, publicKey, privateKey } = this.jwtService.generateJwtKeyPair()

    const key: GeneratedKeyPairDTO = {
      kid,
      publicKey,
      privateKey,
      algorithm: "RS256"
    }

    this.jwtKeyRepo.create({...key,
      isActive: true,
    })
    
    return key
  }
}