import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "app-framework";
import { ILocationEntity } from "./interfaces/location-entity";

@Entity({ name: "locations" })
@Index(["name", "postcode"])
export class LocationEntity extends BaseEntity implements ILocationEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  postcode!: string;
}