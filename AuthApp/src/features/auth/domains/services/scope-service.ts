import { ScopeList, Scopes, ScopeString } from "@/modules/auth/scopes";

export class ScopeService {
  generateDefault = (): ScopeList => [ Scopes.Jundi ]
  normalizeString = (str: string): ScopeString => str.toLowerCase()  
}
