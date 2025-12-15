import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from "typeorm";
//import { User } from "../../user/entities/User.js";
//import { Location } from "../../location/entities/Location.js";
import { Session } from "../../session/entities/session.js";

@Entity({ name: "attendances" })
@Index(["userId"])
//@Index(["locationId"])
@Index(["sessionId"])
export class Attendance {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  // @ManyToOne(() => User, (user) => user.attendances, { nullable: false, onDelete: "CASCADE" })
  // @JoinColumn({ name: "userId" })
  // user!: User;

  @Column()
  userId!: number;

  // // // @ManyToOne(() => Location, (location) => location.attendances, { nullable: false, onDelete: "CASCADE" })
  // // // @JoinColumn({ name: "locationId" })
  // // // location!: Location;

  // // @Column()
  // // locationId!: number;

  // Link to session (new foreign key)
  @ManyToOne(() => Session, (session) => session.attendances, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "sessionId" })
  session!: Session;

  @Column()
  sessionId!: number;

  @Column({ type: "boolean", default: true })
  DidAttend!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
