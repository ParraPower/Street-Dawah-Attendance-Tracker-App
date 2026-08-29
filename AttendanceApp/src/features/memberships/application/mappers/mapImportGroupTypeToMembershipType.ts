import { MembershipTypeEnum } from "@attendance/features/memberships/domain/enums/membership-type-enum";

const membershipMap: Record<string, MembershipTypeEnum> = {
    "new": MembershipTypeEnum.NEW_VOLUNTEERS,
    "regular": MembershipTypeEnum.REGULAR_MEMBERS,
    "management": MembershipTypeEnum.MANAGEMENT,
    "emir": MembershipTypeEnum.EMIR,
    "shurah": MembershipTypeEnum.SHURAH
};
export function mapImportGroupTypeToMembershipType(input: string): MembershipTypeEnum {

    if (!input || input.trim() === "") {
        return MembershipTypeEnum.NONE;
    }

    return input
        .split(",")
        .map(s => s.trim().toLowerCase())
        .reduce((acc, key) => {
            const value = membershipMap[key];
            return value !== undefined ? acc | value : acc;
        }, MembershipTypeEnum.NONE);

}