import { StringValue } from "ms";
import { TokenType } from "../types/jwt.types";

export interface IJwtService {
  signToken(
    userId: string,
    scopes: string[],
    type: TokenType,
    audience?: string | string[],
  ): { token: string; jti: string; expiresIn: StringValue };

  signJwt(payload: object, expiresIn: StringValue): string;

  verifyJwt(token: string, action: (err: Error, decoded: never) => void): void;
}