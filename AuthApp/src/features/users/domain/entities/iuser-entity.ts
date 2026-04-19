import { IBaseAudit } from "@/shared/infrastructure/persistence/interfaces/ibase-audit";
import { IBaseEntityStub } from "@/shared/infrastructure/persistence/interfaces/ibase-entity-stub";

export interface IUserEntity extends IBaseEntityStub, IBaseAudit {

}