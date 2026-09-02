export enum MembershipTypeEnum {
  NONE = 0, // NONE
  NEW_VOLUNTEERS = 1 << 0, // 1
  REGULAR_MEMBERS = 1 << 1, // 2
  MANAGEMENT = 1 << 2, // 4
  EMIR = 1 << 3, // 8
  SHURAH = 1 << 4 // 16
}
