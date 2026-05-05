import { Repository } from "typeorm";
import { Membership } from "../../../domains/membership/entities/Membership";
import AppDataSource from "../../../data/data-source";
import { ImportGroupRow } from "../../../domains/import/entities/import-group-row";
import { mapper } from "../../../mapping/mapper";

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
            const membership = mapper.map(d, ImportGroupRow, Membership) as Membership
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