import { Column, Entity } from "typeorm";
import { BaseEntity } from '@/core/abstracts/base-entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;
  @Column()
  secretHash!: string;
  @Column('simple-array', { default: '' })
  scopes!: string[];
}
