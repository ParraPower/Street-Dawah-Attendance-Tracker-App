import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { IEmirSessionPreferenceEntity } from "./interfaces/emir-session-preference-entity";

@Entity({ name: "emir_session_preferences" })
@Index(["userId", "sessionId"], { unique: true, where: '"isDeleted" IS NOT TRUE' })
@Index(["userId"])
@Index(["sessionId"])
export class EmirSessionPreferenceEntity extends BaseEntity implements IEmirSessionPreferenceEntity {
  @Column({ type: "integer" })
  userId!: number;

  @Column({ type: "integer" })
  sessionId!: number;

  @Column({ type: "boolean", default: true })
  active!: boolean;
}
