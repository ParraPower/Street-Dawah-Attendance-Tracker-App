import AppDataSource from "@/data/data-source";
import { IJwtKeyRepository } from "../../domain/repositories/ijwtkey-repository";
import { JwtKeyRepository } from "../persistence/typeorm/jwt-key-repository";
import { KeyCacheService } from "./key-cache.service";
import { JwtKey } from "../../domain/entities/key-entity";

export class useOnLoadKeyIntoKeyCache {
  private readonly keyCacheService: KeyCacheService = new KeyCacheService()
  private readonly jwtKeyRepository: IJwtKeyRepository = new JwtKeyRepository(AppDataSource.getRepository(JwtKey))
  constructor(
  ) {

  }

  public execute = async () => {
    const keys = await this.jwtKeyRepository.findAll()

    this.keyCacheService.resetCache()

    for (const k of keys) {
      this.keyCacheService.setPublicKeyCache(k.kid, k.publicKey)
      if (k.isActive && k.privateKey) {
        this.keyCacheService.setPrivateKeyCache(k.kid, k.privateKey)
      }
    }

    if (!this.keyCacheService.isPrivateKeySet()) {
      throw new Error('No active private key found');
    }
  }
}