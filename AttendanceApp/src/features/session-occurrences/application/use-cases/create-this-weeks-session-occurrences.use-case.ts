import { mapper } from "../../../../infrastructure/mapping/mapper";
import { MembershipTypeEnum } from "../../../memberships/domain/enums/membership-type-enum";
import { IEmirDateAvailabilityRepository } from "../../../emir-date-availabilities/domain/repositories/iemir-date-availability-repository";
import { EmirSessionPreferenceEntity } from "../../../emir-session-preferences/domain/entities/emir-session-preference-entity";
import { IEmirSessionPreferenceRepository } from "../../../emir-session-preferences/domain/repositories/iemir-session-preference-repository";
import { IMembershipRepository } from "../../../memberships/domain/repositories/imembership-repository";
import { IUserMembershipRepository } from "../../../user-memberships/domain/repositories/iuser-membership-repository";
import { ISessionRepository } from "../../../sessions/domain/repositories/isession-repository";
import { SessionOccurrenceEntity } from "../../domain/entities/session-occurrence-entity";
import { ISessionOccurrenceRepository } from "../../domain/repositories/isession-occurrence-repository";
import { SessionOccurrenceDto } from "../dtos/session-occurrence.dto";
import { SessionOccurrenceActor, SessionOccurrenceAuthorizationService } from "../authorization/session-occurrence-authorization.service";

export interface CreateThisWeeksSessionOccurrencesResult {
  created: SessionOccurrenceDto[];
  createdCount: number;
  skippedExistingCount: number;
  unassignedCount: number;
  unassigned: Array<{ sessionId: number; occurrenceDate: string }>;
}

export class CreateThisWeeksSessionOccurrencesUseCase {
  constructor(
    private readonly occurrenceRepo: ISessionOccurrenceRepository,
    private readonly sessionRepo: ISessionRepository,
    private readonly preferenceRepo: IEmirSessionPreferenceRepository,
    private readonly availabilityRepo: IEmirDateAvailabilityRepository,
    private readonly membershipRepo: IMembershipRepository,
    private readonly userMembershipRepo: IUserMembershipRepository,
    private readonly authorization: SessionOccurrenceAuthorizationService,
  ) {}

  async execute(actor: SessionOccurrenceActor): Promise<CreateThisWeeksSessionOccurrencesResult> {
    this.authorization.assertCanBulkCreate(actor);

    const { startDate, endDate } = this.getCurrentWeek();
    const sessions = (await this.sessionRepo.findAll())
      .filter((session) => !session.isDeleted)
      .sort((a, b) => a.id - b.id);
    const scheduledSessions = sessions.filter((session) => session.dayOfWeek >= 0 && session.dayOfWeek <= 6);
    const existing = await this.occurrenceRepo.findByDateRange(startDate, endDate, true);
    const existingByKey = new Map(existing.map((occurrence) => [`${occurrence.sessionId}:${occurrence.occurrenceDate}`, occurrence]));
    const reservedByDate = new Map<string, Set<number>>();

    for (const occurrence of existing) {
      if (occurrence.mainEmirUserId != null) this.reserve(reservedByDate, occurrence.occurrenceDate, occurrence.mainEmirUserId);
    }

    const preferences = (await this.preferenceRepo.findAll())
      .filter((preference) => !preference.isDeleted && preference.active);
    const memberships = (await this.membershipRepo.findAll())
      .filter((membership) => !membership.isDeleted && (membership.membershipTypesFlag & MembershipTypeEnum.EMIR) !== 0);
    const emirMembershipIds = new Set(memberships.map((membership) => membership.id));
    const userMemberships = (await this.userMembershipRepo.findAll())
      .filter((membership) => !membership.isDeleted && membership.active && emirMembershipIds.has(membership.membershipId));
    const emirUserIds = new Set(userMemberships.map((membership) => membership.userId));
    const preferencesBySession = this.groupPreferences(preferences, emirUserIds);

    const toCreate: Partial<SessionOccurrenceEntity>[] = [];
    const unassigned: Array<{ sessionId: number; occurrenceDate: string }> = [];
    let skippedExistingCount = 0;

    for (const date of this.getDates(startDate, endDate)) {
      const dayOfWeek = new Date(`${date}T00:00:00.000Z`).getUTCDay();
      const dateAvailability = (await this.availabilityRepo.findByDate(new Date(`${date}T00:00:00.000Z`)))
        .filter((availability) => !availability.isDeleted && availability.active && emirUserIds.has(availability.userId));
      const availableUserIds = new Set(dateAvailability.map((availability) => availability.userId));

      for (const session of scheduledSessions.filter((value) => value.dayOfWeek === dayOfWeek)) {
        const key = `${session.id}:${date}`;
        if (existingByKey.has(key)) {
          skippedExistingCount++;
          continue;
        }

        const candidates = preferencesBySession.get(session.id) ?? [];
        const mainEmirUserId = candidates.find((userId) => availableUserIds.has(userId) && !this.isReserved(reservedByDate, date, userId));
        if (mainEmirUserId === undefined) unassigned.push({ sessionId: session.id, occurrenceDate: date });
        else this.reserve(reservedByDate, date, mainEmirUserId);

        toCreate.push({ sessionId: session.id, occurrenceDate: date, mainEmirUserId: mainEmirUserId ?? null });
      }
    }

    const createdEntities = toCreate.length > 0 ? await this.occurrenceRepo.createBulk(toCreate) : [];
    const created = createdEntities.map((occurrence) => mapper.map(occurrence, SessionOccurrenceEntity, SessionOccurrenceDto));
    return {
      created,
      createdCount: created.length,
      skippedExistingCount,
      unassignedCount: unassigned.length,
      unassigned,
    };
  }

  private groupPreferences(preferences: EmirSessionPreferenceEntity[], emirUserIds: Set<number>): Map<number, number[]> {
    const result = new Map<number, number[]>();
    for (const preference of preferences) {
      if (!emirUserIds.has(preference.userId)) continue;
      const users = result.get(preference.sessionId) ?? [];
      if (!users.includes(preference.userId)) users.push(preference.userId);
      result.set(preference.sessionId, users);
    }
    return result;
  }

  private getCurrentWeek(): { startDate: string; endDate: string } {
    const today = new Date();
    const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const start = new Date(todayUtc);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);
    return { startDate: this.formatDate(start), endDate: this.formatDate(end) };
  }

  private getDates(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T00:00:00.000Z`);
    while (current <= end) {
      dates.push(this.formatDate(current));
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private reserve(reservedByDate: Map<string, Set<number>>, date: string, userId: number): void {
    const reserved = reservedByDate.get(date) ?? new Set<number>();
    reserved.add(userId);
    reservedByDate.set(date, reserved);
  }

  private isReserved(reservedByDate: Map<string, Set<number>>, date: string, userId: number): boolean {
    return reservedByDate.get(date)?.has(userId) ?? false;
  }
}
