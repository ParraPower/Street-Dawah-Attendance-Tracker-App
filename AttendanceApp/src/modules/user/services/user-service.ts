// src/domains/user/services/User.service.ts
import AppDataSource from "../../../data/data-source";
import { UserEntity } from "../../../features/users/domain/entities/User";
import { Repository } from "typeorm";

export class UserService {
  private userRepo: Repository<UserEntity>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(UserEntity);
  }

  // CREATE
  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  // READ (by ID)
  async getUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  // READ (all)
  async getAllUsers(): Promise<UserEntity[]> {
    return Promise.resolve([  ]);
    //return await this.userRepo.find();
  }

  // UPDATE
  async updateUser(id: number, updates: Partial<UserEntity>): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return null;

    Object.assign(user, updates);
    return await this.userRepo.save(user);
  }

  // DELETE
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return result.affected !== 0;
  }


  async createAdminUser(): Promise<UserEntity> {
    const adminData: Partial<UserEntity> = {
      name: "Admin User",
      mobile: "0000000000",
      createdBy: 0, // System user
      createdAt: new Date()
    }
    return this.createUser(adminData);
  }
}
