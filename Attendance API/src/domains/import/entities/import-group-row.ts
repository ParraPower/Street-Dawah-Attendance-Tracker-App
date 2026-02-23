//import { UUID } from "crypto";
import { IBaseAudit } from "../../../core/interfaces/ibase-audit.js";
import { IBaseEntityStub } from "../../../core/interfaces/ibase-entity-stub.js";

export class ImportGroupRow implements IBaseEntityStub, IBaseAudit {
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