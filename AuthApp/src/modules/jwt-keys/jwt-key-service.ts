import { Repository } from "typeorm";
import { JwtKey } from "@/domains/keys/key-entity";
import { GeneratedKeyPair } from '@/dtos/keys/generated-key-pair.dto';
import crypto from "crypto";
export class JwtKeyService {
  constructor(private readonly repo: Repository<JwtKey>) {}

  async getActiveKey(): Promise<JwtKey | null> {
    return this.repo.findOne({
      where: { isActive: true },
      order: { createdAt: "DESC" }
    });
  }

  async insertKey() {
    const pair = this.generateJwtKeyPair();

    const entity = this.repo.create({
      kid: pair.kid,
      publicKey: pair.publicKey,
      privateKey: pair.privateKey,
      algorithm: pair.algorithm,
      isActive: true
    });

    await this.repo.save(entity);
    return entity;
  }

  async ensureKeyExists(): Promise<void> {
    const existing = await this.getActiveKey();
    if (existing) return;

    await this.insertKey();
  }

  public generateJwtKeyPair(): GeneratedKeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });

    const kid = crypto.randomUUID();

    return {
      kid,
      publicKey,
      privateKey,
      algorithm: "RS256"
    };
  }
}
