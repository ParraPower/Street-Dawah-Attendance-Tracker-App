import { UserJwtPayload } from "@/dtos/jwt/userJwtPayload.dto";
import { Request } from "express";

export type RequestWithUser = Request & { user?: UserJwtPayload };
