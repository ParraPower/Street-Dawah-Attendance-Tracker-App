import { UserJwtPayload } from "@/modules/jwt/userJwtPayload.dto";
import { Request } from "express";

export type RequestWithUser = Request & { user?: UserJwtPayload };
