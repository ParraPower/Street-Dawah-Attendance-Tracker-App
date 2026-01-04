import _ from 'lodash'

export const Scopes = {
  Jundi: 'jundi',
  Emir: 'ameer',
  Mudeer: 'mudeer',
  Khaleef: 'Khaleef'
} as const;

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

export function isValidScopeString(input: string): boolean {
  if (!_.isString(input)) return false;

  // Split by comma and trim whitespace
  const parts = _(input.split(","))
    .map((p) => _.trim(p))
    .value();

  // Must not be empty
  if (parts.length === 0) return true;

  // No empty segments (e.g., "jundi,,emir")
  if (parts.some((p) => _.isEmpty(p))) return false;

  // All scopes must be valid
  if (parts.some((p) => !VALID_SCOPES.has(p as Scope))) return false;

  return true;
}
