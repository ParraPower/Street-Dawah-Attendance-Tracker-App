import { ScopeList } from "@/features/auth/domain/policies/scope-types";

export class UserDto {
  id!: string;
  email!: string;
  username!: string;
  scopes!: ScopeList;
  createdAt!: Date;
}
