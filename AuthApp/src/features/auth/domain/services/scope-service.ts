import { ScopeList, Scopes, ScopeString, VALID_SCOPES, ScopeRank } from '../policies/scope-types';
import { UserJwtPayload } from '@/core/requests/userJwtPayload.dto';
import _, { isString, isEmpty, trim } from 'lodash';

export class ScopeService {
  generateDefault = (): ScopeList => [Scopes.Jundi];

  normalizeString = (str: string): ScopeString => str.toLowerCase();

  hasScopeByRank(userScope: Scopes, required: Scopes): boolean {
    console.log(`Checking if user scope "${userScope}" satisfies required scope "${required}"`);
    return ScopeRank[userScope] >= ScopeRank[required];
  }

  private handleScopeStr(scopeStr: string): Scopes | null {
    const trimmed = trim(scopeStr).toLowerCase();
    return VALID_SCOPES.has(trimmed as Scopes) ? (trimmed as Scopes) : null;
  }

  parseScopeStringFromJWT(payload: UserJwtPayload): ScopeList {
    const scopeStr = payload.scope;
    console.log("Raw scope string from JWT:", scopeStr);

    if (!isString(scopeStr)) return [];

    const parts = _(scopeStr.split(" "))
      .map((p) => this.handleScopeStr(p))
      .value();

    console.log("Raw scopes from JWT:", parts, parts.some((p) => !VALID_SCOPES.has(p as Scopes)));

    if (parts.length === 0) return [];
    if (parts.some((p) => isEmpty(p))) return [];
    if (parts.some((p) => p === null)) return [];
    if (parts.some((p) => !VALID_SCOPES.has(p as Scopes))) return [];

    return parts as ScopeList;
  }

  parseScopeString(input: string): ScopeList {
    if (!_.isString(input)) return [];

    const parts = _(input.split(","))
      .map((p) => this.handleScopeStr(p))
      .value();

    if (parts.length === 0) return [];
    if (parts.some((p) => isEmpty(p))) return [];
    if (parts.some((p) => p === null)) return [];
    if (parts.some((p) => !VALID_SCOPES.has(p as Scopes))) return [];

    return parts as ScopeList;
  }

  hasScopes(userScopes: ScopeList, requiredScopes: ScopeList): boolean {
    console.log("User scopes:", userScopes, "Required scopes:", requiredScopes);

    let hasAnySufficientScope = false;

    for (const required of requiredScopes) {
      hasAnySufficientScope = userScopes.some(userScope => this.hasScopeByRank(userScope, required));
      console.log(`Checking if user has scope "${required}":`, hasAnySufficientScope);
      if (hasAnySufficientScope) break;
    }

    if (!hasAnySufficientScope) {
      console.log(`User is missing scopes: "${requiredScopes}"`);
      return false;
    }

    console.log("User has required scopes.");
    return true;
  }
}