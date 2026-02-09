import { IAudit } from "../../../core/interfaces/iaudit.js";
import { IBaseEntity } from "../../../core/interfaces/ibase-entity.js";

export interface IMembership extends IAudit, IBaseEntity
{
  name: string;
  membershipTypesFlag: number;
}
