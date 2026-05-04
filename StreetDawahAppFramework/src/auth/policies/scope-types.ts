export enum Scopes {
  Jundi = 'jundi',
  Emir = 'ameer',
  Mudeer = 'mudeer',
  Khaleef = 'khaleef'
}

// #region consts

export const VALID_SCOPES = new Set<Scope>(Object.values(Scopes));

export const ScopeRank: Record<Scopes, number> = {
  [Scopes.Jundi]: 1,
  [Scopes.Emir]: 2,
  [Scopes.Mudeer]: 3,
  [Scopes.Khaleef]: 4,
};

// #endregion

// #region types

export type Scope = typeof Scopes[keyof typeof Scopes];

export type ScopeList = Scope[];

type JoinScopes<T extends readonly Scope[]> =
  T extends [] ? '' :
  T extends [infer Only extends Scope] ? Only :
  T extends [infer First extends Scope, ...infer Rest extends Scope[]]
    ? `${First},${JoinScopes<Rest>}`
    : string;

export type ScopeString = JoinScopes<ScopeList>;