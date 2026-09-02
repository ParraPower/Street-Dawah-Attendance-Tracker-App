import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { IDawahDayEntity } from "./interfaces/dawah-day-entity";

@Entity({ name: "dawah_days" })
@Index(["dayOfWeek"])
export class DawahDayEntity extends BaseEntity implements IDawahDayEntity {
  @Column({ type: "smallint" })
  dayOfWeek!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "boolean", default: false })
  active!: boolean;
}
