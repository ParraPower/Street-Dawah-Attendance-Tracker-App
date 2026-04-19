import { StringValue } from "ms";
import { TokenType } from "../types/jwt.types";
import { IJwtService } from '@street-dawah/app-framework';


export interface IAuthAppJwtService extends IJwtService {
    signToken(
    userId: string,
    scopes: string[],
    type: TokenType,
    audience?: string | string[],
    ): { token: string; jti: string; expiresIn: StringValue }; 
    
}