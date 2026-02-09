import { UserJwtPayload } from '@/dtos/jwt/userJwtPayload.dto';
import _ from 'lodash'

export enum Scopes {
  Jundi = 'jundi',
  Emir = 'ameer',
  Mudeer = 'mudeer',
  Khaleef = 'khaleef'
}

// Define hierarchy
const ScopeRank: Record<Scopes, number> = {
  [Scopes.Jundi]: 1,
  [Scopes.Emir]: 2,
  [Scopes.Mudeer]: 3,
  [Scopes.Khaleef]: 4,
};

// Check if a user has a scope (directly or implicitly)
export function hasScope(userScope: Scopes, required: Scopes): boolean {
  return ScopeRank[userScope] >= ScopeRank[required];
}


export type Scope = typeof Scopes[keyof typeof Scopes];

export type ScopeList = Scope[];

type JoinScopes<T extends readonly Scope[]> =
  T extends [] ? '' :
  T extends [infer Only extends Scope] ? Only :
  T extends [infer First extends Scope, ...infer Rest extends Scope[]]
    ? `${First},${JoinScopes<Rest>}`
    : string;

export type ScopeString = JoinScopes<ScopeList>;

const VALID_SCOPES = new Set<Scope>(Object.values(Scopes));

export function parseScopeStringFromJWT(payload: UserJwtPayload): ScopeList {
  const scopeStr = payload.scope;

  if (!_.isString(scopeStr)) return [];

  const parts = _(scopeStr.split(" "))
    .map((p) => _.trim(p))
    .value();

  if (parts.some((p) => !VALID_SCOPES.has(p as Scope))) return [];

  return parts as ScopeList;
}

export function parseScopeString(input: string): ScopeList {
  if (!_.isString(input)) return [];

  // Split by comma and trim whitespace
  const parts = _(input.split(","))
    .map((p) => _.trim(p))
    .value();

  // Must not be empty
  if (parts.length === 0) return [];

  // No empty segments (e.g., "jundi,,emir")
  if (parts.some((p) => _.isEmpty(p))) return [];

  // All scopes must be valid
  if (parts.some((p) => !VALID_SCOPES.has(p as Scope))) return [];

  return parts as ScopeList;
}

export function hasScopes(
  userScopes: ScopeList,
  requiredScopes: ScopeList): boolean {
  for (const required of requiredScopes) {
    const hasAtLeastOne = userScopes.some(userScope => hasScope(userScope, required));
    if (!hasAtLeastOne) {
      return false;
    }
  }
  return true;
}