import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn';
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { IBaseAudit } from '../interfaces/ibase-audit';
import { IBaseEntityStub } from '../interfaces/ibase-entity-stub';

export abstract class BaseEntity implements IBaseAudit, IBaseEntityStub {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true })
  createdBy?: number;

  @Column({ nullable: true })
  updatedBy?: number;

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'boolean', nullable: true })
  isDeleted?: boolean | null;
}
