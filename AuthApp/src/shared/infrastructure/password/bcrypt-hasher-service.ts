
import bcrypt from "bcrypt";
import { IHasherService } from "@/features/auth/domains/services/hasher-service";

export class BcryptHasherService implements IHasherService {
  generateHash(raw: string) { return bcrypt.hash(raw, 12); }
  verify(raw: string, hash: string) { return bcrypt.compare(raw, hash); }
}
