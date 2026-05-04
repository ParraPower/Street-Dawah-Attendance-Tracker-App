import { Repository, In } from "typeorm";
import { BaseRepository } from "@auth/shared/infrastructure/persistence/typeorm/abstracts/base-repository";
import { UserEntity } from "../../../domain/entities/user-entity";
import { IUserRepository } from "../../../domain/repositories/iuser-repository";
import { ILike } from 'typeorm'

export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(repo: Repository<UserEntity>) {
    super(repo);
  }
  findByTemporaryPasswordGuid(temporaryPasswordGuid: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { temporaryPasswordGuid }
    })
  }

  private prepUserForUpsert(user: Partial<UserEntity> | UserEntity) {
    return {...user, email: user.email?.toLowerCase(), username: user.username?.toLowerCase() }
  }

  async findByUsernamesAndEmails(
    usernames: string[],
    emails: string[]
  ): Promise<UserEntity[]> {
    return this.find({
      where: [
        { email: In(emails.map(e => e.toLowerCase())) },
        { username: In(usernames.map(u => u.toLowerCase())) }
      ]
    });
  }

  async createBulk(entities: UserEntity[]): Promise<UserEntity[]> {
    return await this.repo.manager.transaction(async (trx) => {
      const prepped = entities.map(e => this.prepUserForUpsert(e) as UserEntity);

      return await trx.save(UserEntity, prepped);
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { email: ILike(email.toLowerCase()) }
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.findOne({
      where: { id }
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { username: ILike(username.toLowerCase()) }
    });
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    user = this.prepUserForUpsert(user)

    const entity = this.repo.create(user);
    return await this.repo.save(entity);
  }

  async update(id: number, user: Partial<UserEntity>): Promise<UserEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    user = this.prepUserForUpsert(user)

    Object.assign(existing, user);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    // Use soft delete from BaseRepository
    await this.softDelete(id);
    return true;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.find();
  }
}