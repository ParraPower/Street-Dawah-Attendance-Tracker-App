import { IBaseEntityStub } from "../../../core/interfaces/ibase-entity-stub.js";

export class ImportUserRow implements IBaseEntityStub {
  id!: number;

  email!: string;
  username!: string;
  password?: string;

  constructor(data?: Partial<ImportUserRow>) {
    Object.assign(this, data);
  }
}
