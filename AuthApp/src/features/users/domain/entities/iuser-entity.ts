import { IBaseAudit } from "@auth/shared/infrastructure/persistence/interfaces/ibase-audit";
import { IBaseEntityStub } from "@auth/shared/infrastructure/persistence/interfaces/ibase-entity-stub";

export interface IUserEntity extends IBaseEntityStub, IBaseAudit {

}