import { Scopes } from "app-framework";
import { CreateSessionOccurrenceDto } from "../dtos/create-session-occurrence.dto";
import { UpdateSessionOccurrenceDto } from "../dtos/update-session-occurrence.dto";

export interface SessionOccurrenceActor {
  scopes: Scopes[];
}

export class SessionOccurrenceAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionOccurrenceAuthorizationError";
  }
}

export class SessionOccurrenceAuthorizationService {
  canViewNonPublic(actor: SessionOccurrenceActor): boolean {
    return this.hasScopeOrHigher(actor, Scopes.Mudeer);
  }

  assertCanCreate(actor: SessionOccurrenceActor, input: CreateSessionOccurrenceDto): void {
    const isSettingVisibility = input.showPublicly !== undefined;
    const isAssigningEmir = input.mainEmirUserId !== undefined;

    if ((isSettingVisibility || isAssigningEmir) && !this.hasScopeOrHigher(actor, Scopes.Mudeer)) {
      throw new SessionOccurrenceAuthorizationError(
        "Only Mudeers or Khaleefs can set session occurrence visibility or assign its main Emir",
      );
    }
  }

  assertCanBulkCreate(actor: SessionOccurrenceActor): void {
    if (!this.hasScopeOrHigher(actor, Scopes.Mudeer)) {
      throw new SessionOccurrenceAuthorizationError("Only Mudeers or Khaleefs can create session occurrences in bulk");
    }
  }

  assertCanUpdate(actor: SessionOccurrenceActor, input: UpdateSessionOccurrenceDto): void {
    if (input.mainEmirUserId !== undefined && !this.hasScopeOrHigher(actor, Scopes.Emir)) {
      throw new SessionOccurrenceAuthorizationError("Only Emirs or higher can set the main Emir");
    }

    if (input.showPublicly !== undefined && !this.hasScopeOrHigher(actor, Scopes.Mudeer)) {
      throw new SessionOccurrenceAuthorizationError("Only Mudeers or Khaleefs can change public visibility");
    }

    if (!this.hasScopeOrHigher(actor, Scopes.Mudeer)) {
      const allowedKeys = new Set(["mainEmirUserId"]);
      const hasOtherChanges = Object.keys(input).some((key) => !allowedKeys.has(key));
      if (hasOtherChanges) {
        throw new SessionOccurrenceAuthorizationError("Emirs can only update the main Emir");
      }
    }
  }

  private hasScopeOrHigher(actor: SessionOccurrenceActor, requiredScope: Scopes): boolean {
    const scopeRank: Record<Scopes, number> = {
      [Scopes.Jundi]: 1,
      [Scopes.Emir]: 2,
      [Scopes.Mudeer]: 3,
      [Scopes.Khaleef]: 4,
    };
    return actor.scopes.some((scope) => scopeRank[scope] >= scopeRank[requiredScope]);
  }
}
