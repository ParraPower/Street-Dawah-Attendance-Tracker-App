import { Entity, Column } from 'typeorm';
import { IUserEntity } from './interfaces/user-entity';
import { BaseEntity } from 'app-framework';


@Entity("users")
export class UserEntity extends BaseEntity implements IUserEntity {
  @Column({ nullable: true, type: 'varchar' })
  shirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL' | undefined;
  
  @Column({ nullable: true })
  currentSuburb?: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  mobile!: string;

  @Column({ nullable: true })
  authUserId?: number;
  
  @Column({ default: false })
  whatsAppMsgOptIn!: boolean;
}
