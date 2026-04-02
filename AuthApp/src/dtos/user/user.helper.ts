import { UserEntity } from "@/features/users/domain/entities/user-entity";
import { ScopeList, Scopes } from "@/modules/auth/scopes";

export const getScopeesFromUserEntity = (user: UserEntity): ScopeList => {
  const response = user?.scopes.map(scope =>
    Object.values(Scopes).includes(scope as Scopes)
      ? (scope as Scopes)
      : undefined
  ) ?? [];

  return response as ScopeList;
}