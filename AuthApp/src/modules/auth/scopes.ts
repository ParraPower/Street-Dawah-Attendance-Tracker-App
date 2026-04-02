import { UserJwtPayload } from '@/core/requests/userJwtPayload.dto';
import _, {isString, isEmpty, trim } from 'lodash'

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
export function hasScopeByRank(userScope: Scopes, required: Scopes): boolean {
  console.log(`Checking if user scope "${userScope}" satisfies required scope "${required}"`);
  return ScopeRank[userScope] >= ScopeRank[required];
}

const handleScopeStr = (scopeStr: string): Scopes | null => {
  const trimmed = trim(scopeStr).toLowerCase();
  return VALID_SCOPES.has(trimmed as Scopes) ? trimmed as Scopes : null;
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

  console.log("Raw scope string from JWT:", scopeStr);

  if (!isString(scopeStr)) return [];

  const parts = _(scopeStr.split(" "))
    .map((p) => handleScopeStr(p))
    .value();

  console.log("Raw scopes from JWT:", parts, parts.some((p) => !VALID_SCOPES.has(p as Scope)));


  if (parts.length === 0) return [];
  if (parts.some((p) => isEmpty(p))) return [];
  if (parts.some((p) => p === null)) return [];

  if (parts.some((p) => !VALID_SCOPES.has(p as Scope))) return [];

  return parts as ScopeList;
}

export function parseScopeString(input: string): ScopeList {
  if (!_.isString(input)) return [];

  // Split by comma and trim whitespace
  const parts = _(input.split(","))
    .map((p) => handleScopeStr(p))
    .value();

  // Must not be empty
  if (parts.length === 0) return [];

  // No empty segments (e.g., "jundi,,emir")
  if (parts.some((p) => isEmpty(p))) return [];
  if (parts.some((p) => p === null)) return [];

  // All scopes must be valid
  if (parts.some((p) => !VALID_SCOPES.has(p as Scope))) return [];

  return parts as ScopeList;
}

export function hasScopes(
  userScopes: ScopeList,
  requiredScopes: ScopeList): boolean {
  
  console.log("User scopes:", userScopes, "Required scopes:", requiredScopes);

  let hasAnySufficientScope = false;

  for (const required of requiredScopes) {
    hasAnySufficientScope = userScopes.some(userScope => hasScopeByRank(userScope, required));
    console.log(`Checking if user has scope "${required}":`, hasAnySufficientScope);
    if (hasAnySufficientScope) {
      break;
    }
  }

  if (!hasAnySufficientScope) {
    console.log(`User is missing scopes: "${requiredScopes}"`);
    return false;
  }

  console.log("User has required scopes.");

  return true;
}