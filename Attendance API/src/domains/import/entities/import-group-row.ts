//import { UUID } from "crypto";
import { IAudit } from "../../../core/interfaces/iaudit.js";
import { IBaseEntity } from "../../../core/interfaces/ibase-entity.js";

export class ImportGroupRow implements IBaseEntity, IAudit {
    id!: number;
    Name!: string;
    Type!: string
    importId!: number;
    isDeleted?: boolean | undefined;
    createdAt!: Date;
    createdBy!: number;
    updatedAt?: Date | undefined;
    updatedBy?: number | undefined;

}