import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
// import { Attendance } from "../../attendance/entities/Attendance.js";
// import { Session } from "../../session/entities/Session.js";

@Entity({ name: "locations" })
export class Location {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  postcode!: string;

  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  // @OneToMany(() => Attendance, (a) => a.location)
  // attendances?: Attendance[];

  // @OneToMany(() => Session, (s) => s.location)
  // sessions?: Session[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
