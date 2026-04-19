import { IBaseAudit } from "../../../core/interfaces/ibase-audit.js";
import { IBaseEntityStub } from "../../../core/interfaces/ibase-entity-stub.js";

export interface IUser extends  IBaseEntityStub, IBaseAudit
{
  id: number;
  name?: string;
  mobile: string;
  passwordHash: string;
}
