import AppDataSource from "@auth/data/data-source"
import { IJwtKeyRepository } from "../../domain/repositories/ijwtkey-repository"
import { JwtKeyRepository } from "../persistence/typeorm/jwt-key-repository"
import { JwtKey } from "../../domain/entities/key-entity"
import { GenerateActiveKeyPairUseCase } from "../../application/use-cases/generate-key-pair.usecase"
import { AuthAppJwtService } from "@auth/shared/infrastructure/auth/jwt-service"
import { KeyCacheService } from "./key-cache.service"

export class useOnLoadEnsureKeyExists {
  private readonly keyRepository: IJwtKeyRepository = new JwtKeyRepository(AppDataSource.getRepository(JwtKey))
  private readonly generateKeyPair: GenerateActiveKeyPairUseCase = new GenerateActiveKeyPairUseCase(new AuthAppJwtService(new KeyCacheService()), this.keyRepository)

  constructor() {
  }

  public execute = async () => {
    await this.generateKeyPair.execute()
  }
}