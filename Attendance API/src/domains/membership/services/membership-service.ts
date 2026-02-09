import { Repository } from "typeorm";
import { Membership } from "../entities/membership.js";
import AppDataSource from "../../../data/data-source.js";
import { ImportGroupRow } from "../../import/entities/import-group-row.js";
import { mapToMembership } from "../../../mapping/profiles/membership-profile.js";

export class MembershipService {
    private membershipRepo: Repository<Membership>

    constructor () {
        this.membershipRepo = AppDataSource.getRepository(Membership)
    }

    async createMembership(data: Partial<Membership>): Promise<Membership> {
        const membership = this.membershipRepo.create(data);
        return await this.membershipRepo.save(membership)
    }

    async createMembershipBulkViaImport(data: ImportGroupRow[]): Promise<Membership[]> {
        const insertData = data.map(d => {
            const membership = mapToMembership(d)
            membership.createdAt = new Date();
            membership.createdBy = 1; // TODO: Replace with actual user ID
            return membership;
        })

        await this.membershipRepo.insert(
            insertData
        )

        return insertData;
    }
}