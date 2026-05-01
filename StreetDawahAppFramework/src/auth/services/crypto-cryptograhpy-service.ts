import { ICryptographyService } from "../interfaces/cryptograpahy-service";
import { randomBytes, createPublicKey } from "crypto";

export class CryptoCryptographyService implements ICryptographyService {
    createPublicKey(pem: string): object {
       return createPublicKey(pem)
    }
    generateRandomBytes(keylength: number): NonSharedBuffer {
        return randomBytes(keylength)
    }
}