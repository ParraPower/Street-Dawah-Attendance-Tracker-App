import { ScopeList } from "@/modules/auth/scopes";

export class UserDto {
  id!: string;
  email!: string;
  username!: string;
  scopes!: ScopeList;
  createdAt!: Date;
}
