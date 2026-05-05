import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn/*, OneToMany*/ } from "typeorm";
import { IBaseAudit } from "../../../core/interfaces/ibase-audit.js";
import { IBaseEntityStub } from "../../../core/interfaces/ibase-entity-stub.js";
import { ILocation } from "../interfaces/ilocation.js";
// import { Attendance } from "../../attendance/entities/Attendance.js";
// import { Session } from "../../session/entities/Session.js";

@Entity({ name: "locations" })
export class Location implements ILocation, IBaseAudit, IBaseEntityStub{
  
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  postcode!: string;

  @Column({ type: "boolean", default: false })
  isDeleted?: boolean;

  // @OneToMany(() => Attendance, (a) => a.location)
  // attendances?: Attendance[];

  // @OneToMany(() => Session, (s) => s.location)
  // sessions?: Session[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @Column()
  createdBy!: number;

  @Column({ nullable: true })
  updatedBy?: number;  
}
