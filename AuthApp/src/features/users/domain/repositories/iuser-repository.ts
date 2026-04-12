import { UserEntity } from "../entities/user-entity";

export interface IUserRepository {
  findById(id: number): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsernamesAndEmails(usernames: string[], emails: string[]): Promise<UserEntity[]>;
  findByTemporaryPasswordGuid(temporaryPasswordGuid: string): Promise<UserEntity | null>;
  createBulk(entities: UserEntity[]): Promise<UserEntity[]>
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: number, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<UserEntity[]>;
}
