import { StringValue } from "ms";
import { TokenType } from "../types/jwt.types";
import { IJwtService } from 'app-framework';


export interface IAuthAppJwtService extends IJwtService {
    signTokenWithExtraClaims(
    userId: string,
    scopes: string[],
    type: TokenType,
    audience?: string | string[],
    extraClaims?: Record<string, any>,
    ): { token: string; jti: string; expiresIn: StringValue }; 
    
    verifyJwtSync(token: string): never;
}