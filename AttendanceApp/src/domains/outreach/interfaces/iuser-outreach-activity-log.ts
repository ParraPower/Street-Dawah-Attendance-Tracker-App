import { OutreachActivityTypeEnum } from "../enums/outreach-activity-type-enum.js";
import { OutreachDirectionTypeEnum } from "../enums/outreach-direction-type-enum.js";

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