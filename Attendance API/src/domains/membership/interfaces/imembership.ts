import { IBaseAudit } from "../../../core/interfaces/ibase-audit.js";
import { IBaseEntityStub } from "../../../core/interfaces/ibase-entity-stub.js";

export interface IMembership extends IBaseAudit, IBaseEntityStub
{
  name: string;
  membershipTypesFlag: number;
}
