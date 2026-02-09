// src/domains/user/services/User.service.ts
import AppDataSource from "../../../data/data-source.js";
import { User } from "../entities/user.js";
import { Repository } from "typeorm";

export class UserService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  // CREATE
  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  // READ (by ID)
  async getUserById(id: number): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  // READ (all)
  async getAllUsers(): Promise<User[]> {
    return Promise.resolve([  ]);
    //return await this.userRepo.find();
  }

  // UPDATE
  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
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


  async createAdminUser(): Promise<User> {
    const adminData: Partial<User> = {
      name: "Admin User",
      mobile: "0000000000",
      passwordHash: "hashed_password", // Replace with actual hash
      passwordSalt: "random_salt",   // Replace with actual salt
      createdBy: 0, // System user
      createdAt: new Date()
    }
    return this.createUser(adminData);
  }
}
