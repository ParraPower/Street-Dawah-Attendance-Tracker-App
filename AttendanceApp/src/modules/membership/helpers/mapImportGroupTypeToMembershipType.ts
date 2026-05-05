import { MembershipTypeEnum } from "../../../domains/membership/enums/membership-type-enum.js";

const membershipMap: Record<string, MembershipTypeEnum> = {
    "new": MembershipTypeEnum.NEW_VOLUNTEERS,
    "regular": MembershipTypeEnum.REGULAR_MEMBERS,
    "emir": MembershipTypeEnum.EMIR,
    "admin": MembershipTypeEnum.ADMIN
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