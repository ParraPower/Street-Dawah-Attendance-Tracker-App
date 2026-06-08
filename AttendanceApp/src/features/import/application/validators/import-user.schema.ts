import Joi from "joi";

export const importUserSchema = Joi.object({
  name: Joi.string().required(),
  reference: Joi.string().allow(null, ""),
  joinedDate: Joi.date().allow(null, ""),
  lastAttendance: Joi.date().allow(null, ""),
  location: Joi.string().allow(null, ""),
  regularLocation: Joi.string().allow(null, ""),
  lastAttendedBefore60Days: Joi.any().allow(null, ""),
  number: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  whatsappLink: Joi.string().allow(null, ""),
  status: Joi.string().allow(null, ""),
  managementFeedbackrequiredtoremove: Joi.string().allow(null, ""),
  outreachDate: Joi.date().allow(null, ""),
  whoReachedOut: Joi.string().allow(null, ""),
  socials: Joi.boolean().allow(null, ""),
  university: Joi.boolean().allow(null, ""),
  outcome: Joi.string().allow(null, "")

});

export const importUsersSchema = Joi.object({
  users: Joi.array().items(importUserSchema).required(),
});
