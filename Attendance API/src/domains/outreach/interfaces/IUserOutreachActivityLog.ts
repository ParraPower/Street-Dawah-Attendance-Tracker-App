import { OutreachActivityTypeEnum } from "../enums/OutreachActivityTypeEnum.js";
import { OutreachDirectionTypeEnum } from "../enums/OutreachDirectionTypeEnum.js";

export interface IUserOutreachActivityLog {
  id: number;

  volunteerUserId: number;

  managementOutreachUserId: number;
  activityDate: Date;

  directionType: OutreachDirectionTypeEnum;

  text: string;

  activityType: OutreachActivityTypeEnum;

  threadId?: number;
  createdAt: Date;
  updatedAt: Date;
}