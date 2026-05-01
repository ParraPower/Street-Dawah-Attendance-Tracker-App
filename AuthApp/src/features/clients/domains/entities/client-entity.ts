import { Column, Entity } from "typeorm";
import { BaseEntity } from 'app-framework';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;
  @Column()
  secretHash!: string;
  @Column('simple-array', { default: '' })
  scopes!: string[];
}
