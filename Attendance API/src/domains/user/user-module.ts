// src/domains/user/user.module.ts
import { User } from "./entities/user.js";
import { UserService } from "./services/user-service.js";

export const UserEntities = [
  User
];

export { User }

export const UserServices = [
  UserService
]

export { UserService }