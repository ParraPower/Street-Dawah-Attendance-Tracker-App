import { ScopeService, ScopeList, Scopes } from "app-framework";

const scopeService = new ScopeService()

const hasScopes = (userScopes: never, requiredScopes: never) => scopeService.hasScopes(userScopes, requiredScopes)
const parseScopeStringFromJWT = (payload: never) => scopeService.parseScopeStringFromJWT(payload)

export { hasScopes, parseScopeStringFromJWT, ScopeList, Scopes }