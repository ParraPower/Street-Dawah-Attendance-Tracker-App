import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { IEmirDateAvailabilityEntity } from "./interfaces/emir-date-availability-entity";

@Entity({ name: "emir_date_availabilities" })
@Index(["userId", "availabilityDate"], { unique: true, where: '"isDeleted" IS NOT TRUE' })
@Index(["userId"])
@Index(["availabilityDate"])
export class EmirDateAvailabilityEntity extends BaseEntity implements IEmirDateAvailabilityEntity {
  @Column({ type: "integer" })
  userId!: number;

  @Column({ type: "date" })
  availabilityDate!: Date;

  @Column({ type: "boolean", default: true })
  active!: boolean;
}
