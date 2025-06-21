import Joi from 'joi';

export const loginUserValidationSchema = Joi.object({
  email: Joi.string().email().required().min(3).max(30),
  password: Joi.string().required().min(3),
});
