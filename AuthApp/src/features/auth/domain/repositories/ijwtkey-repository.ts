import { JwtKey } from "../entities/key-entity";

export interface IJwtKeyRepository {
  findById(id: number): Promise<JwtKey | null>;
  findByKeyId(email: string): Promise<JwtKey | null>;
  findActiveKey(): Promise<JwtKey | null>;
  create(user: Partial<JwtKey>): Promise<JwtKey>;
  update(id: number, user: Partial<JwtKey>): Promise<JwtKey | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<JwtKey[]>;
}
