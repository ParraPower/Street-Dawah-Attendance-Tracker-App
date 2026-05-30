import { StringValue } from "ms";
import { TokenType } from "../types/jwt.types";
import { UUID } from "crypto";

export interface IJwtService {
  signToken(
    userId: string,
    scopes: string[],
    type: TokenType,
    expiresIn: StringValue,
    issuer: string,
    audience?: string | string[]
  ): { token: string; jti: string; expiresIn: StringValue };

  signJwt(payload: object, expiresIn: StringValue): string;

  verifyJwt(token: string, action: (err: Error, decoded: never) => void): void;

  verifyJwtSync(token: string): never;

  generateJwtKeyPair(): { kid: UUID, publicKey: string, privateKey: string };
}