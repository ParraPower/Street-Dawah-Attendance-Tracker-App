import { IAudit } from "../../../core/interfaces/iaudit.js";
import { IBaseEntity } from "../../../core/interfaces/ibase-entity.js";

export interface IUser extends  IBaseEntity, IAudit
{
  id: number;
  name?: string;
  mobile: string;
  passwordHash: string;
}
