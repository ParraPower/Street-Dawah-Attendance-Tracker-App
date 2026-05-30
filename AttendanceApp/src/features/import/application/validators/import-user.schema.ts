import Joi from "joi";

export const importUserSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  username: Joi.string().alphanum().min(3).max(30).lowercase().required(),
  password: Joi.string().optional(),
});

export const importUsersSchema = Joi.object({
  users: Joi.array().items(importUserSchema).required(),
});
