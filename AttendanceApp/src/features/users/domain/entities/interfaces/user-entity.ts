import { IBaseAudit, IBaseEntityStub } from 'app-framework';

export interface IUserEntity extends IBaseEntityStub, IBaseAudit
{
  name?: string;
  mobile: string;
  shirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL';
  currentSuburb?: number
}
