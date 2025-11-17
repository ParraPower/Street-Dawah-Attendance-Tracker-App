import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const validateDto = (DtoClass: any, skipMissing = false) => async (req: any, res: any, next: () => any) => {
  const instance = plainToInstance(DtoClass, req.body);
  const errors = await validate(instance, { skipMissingProperties: skipMissing });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};