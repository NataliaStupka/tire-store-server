import Joi from 'joi';

//створенні нової шини:
export const createTireSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  price: Joi.number().integer().required(),
  size: Joi.string().required(),
  producer: Joi.string().required(),
  model: Joi.string().required(),
  layering: Joi.string().required(),
  //   image: Joi.string(),
  //   stock: Joi.number(),
  //   instock: Joi.boolean(),
});

//при оновленні шини:
export const updateTireSchema = Joi.object({
  title: Joi.string().min(3).max(30),
  price: Joi.number().integer(),
  size: Joi.string(),
  producer: Joi.string(),
  model: Joi.string(),
  layering: Joi.string(),
  //   image: Joi.string(),
  //   stock: Joi.number(),
  //   instock: Joi.boolean(),
});

// прописати ☝️ повідомлень про помилки  ?????
//
//const validationResult = createTireSchema.validate(userData, {
//   abortEarly: false,
// });
