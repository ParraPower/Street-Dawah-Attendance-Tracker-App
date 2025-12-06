export interface IMembership 
{
  id: number;
  name?: string;
  mobile: string;
  passwordHash: string;
  passwordSalt: string;
}
