
import { hash, compare } from "bcrypt";
import { IHasherService } from "../interfaces/hasher-service"

export class BcryptHasherService implements IHasherService {
  async generateWithSize(password: string, size: number) { return await hash(password, size); }
  async generate(password: string) { return await hash(password, 12); }
  async verify(raw: string, hash: string) { return await compare(raw, hash); }
}
