import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { BaseEntity } from "@/shared/infrastructure/persistence/typeorm/abstracts/base-entity";
import { IsNull } from "typeorm";

export abstract class BaseRepository<T extends BaseEntity> {
  protected readonly repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  // --- Global filter: treat undefined as not deleted ---
  protected notDeletedFilter(): FindOptionsWhere<T>[] {
    return [
      { isDeleted: false } as FindOptionsWhere<T>,
      { isDeleted: undefined } as FindOptionsWhere<T>,
      { isDeleted: IsNull() } as FindOptionsWhere<T>,
    ];
  }

  // Merge user-provided where with the not-deleted filter
  protected mergeWhere(
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[]
  ): FindOptionsWhere<T>[] {
    if (!where) return this.notDeletedFilter();

    const userWhere = Array.isArray(where) ? where : [where];

    return userWhere.flatMap((w) =>
      this.notDeletedFilter().map((nd) => ({ ...w, ...nd }))
    );
  }

  // --- Standard find methods ---
  find(options?: FindManyOptions<T>) {
    return this.repo.find({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  findOne(options?: FindOneOptions<T>) {
    return this.repo.findOne({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
    return this.repo.findBy(this.mergeWhere(where));
  }

  findOneBy(where: FindOptionsWhere<T>) {
    return this.repo.findOneBy(this.mergeWhere(where)[0]);
  }

  count(options?: FindManyOptions<T>) {
    return this.repo.count({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  exists(options?: FindManyOptions<T>) {
    return this.repo.exists({
      ...options,
      where: this.mergeWhere(options?.where),
    });
  }

  // --- QueryBuilder with automatic filter ---
  createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repo
      .createQueryBuilder(alias)
      .andWhere(`${alias}.isDeleted = false OR ${alias}.isDeleted IS NULL`);
  }

  // --- Soft delete ---
  async softDelete(id: number) {
    await this.repo.update(id, { isDeleted: true } as any);
  }
}