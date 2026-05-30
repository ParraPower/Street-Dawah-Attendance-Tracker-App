import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  IsNull,
} from 'typeorm';
import { BaseEntity } from '../../abstracts/base-entity';

export abstract class BaseRepository<T extends BaseEntity> {
  protected readonly repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  protected notDeletedFilter(): FindOptionsWhere<T>[] {
    return [
      { isDeleted: false } as FindOptionsWhere<T>,
     // isDeleted: undefined } as FindOptionsWhere<T>,
      { isDeleted: IsNull() } as FindOptionsWhere<T>,
    ];
  }

  protected mergeWhere(
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[]
  ): FindOptionsWhere<T>[] {
    if (!where) return this.notDeletedFilter();

    const userWhere = Array.isArray(where) ? where : [where];

    return userWhere.flatMap((w) =>
      this.notDeletedFilter().map((nd) => ({ ...w, ...nd }))
    );
  }

  async find(options?: FindManyOptions<T>) {
    return await this.repo.find({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  async findOne(options?: FindOneOptions<T>) {
    return await this.repo.findOne({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  async findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
    return await this.repo.findBy(this.mergeWhere(where));
  }

  async findOneBy(where: FindOptionsWhere<T>) : Promise<T | null> {
    return await this.repo.find({
    where: this.mergeWhere(where),
    take: 1,
  }).then(results => results[0] || null);
  }

  async count(options?: FindManyOptions<T>) {
    return await this.repo.count({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  async exists(options?: FindManyOptions<T>) {
    return await this.repo.exists({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repo
      .createQueryBuilder(alias)
      .andWhere(`${alias}.isDeleted = false OR ${alias}.isDeleted IS NULL`);
  }

  async softDelete(id: number) {
    await this.repo.update(id, { isDeleted: true } as any);
  }
}
