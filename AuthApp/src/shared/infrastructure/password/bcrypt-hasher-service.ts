
import bcrypt from "bcrypt";
import { IHasherService } from "@/features/auth/domains/services/hasher-service";

export class BcryptHasherService implements IHasherService {
  async generateWithSize(password: string, size: number) { return await bcrypt.hash(password, size); }
  async generate(password: string) { return await bcrypt.hash(password, 12); }
  async verify(raw: string, hash: string) { return await bcrypt.compare(raw, hash); }
}
