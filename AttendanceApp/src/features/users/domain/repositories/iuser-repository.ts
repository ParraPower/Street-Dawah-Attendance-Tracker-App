import { UserEntity } from "../entities/user-entity";

export interface IUserRepository {
  findById(id: number): Promise<UserEntity | null>;
  findByAuthUserId(authUserId: number): Promise<UserEntity | null>;
  findByMobile(mobile: string): Promise<UserEntity | null>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: number, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<UserEntity[]>;
  createBulk(entities: UserEntity[]): Promise<UserEntity[]>;
}
