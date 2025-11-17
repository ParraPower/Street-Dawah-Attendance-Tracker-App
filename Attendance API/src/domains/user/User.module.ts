// src/domains/user/user.module.ts
import { User } from "./entities/User.js";
import { UserService } from "./services/User.service.js";

export const UserEntities = [
  User
];

export { User }

export const UserServices = [
  UserService
]

export { UserService }