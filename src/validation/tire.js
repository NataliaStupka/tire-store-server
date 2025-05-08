import Joi from 'joi';

//створенні нової шини:
// .allow('') Дозволяє порожні значення,
export const createTireSchema = Joi.object({
  category: Joi.string()
    .required()
    .valid('loader', 'industrial', 'agricultural', 'rims')
    .messages({
      'any.required': 'Category is required',
      'any.only':
        'Category must be one of: loader, industrial, agricultural, rims',
    }),
  title: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title must not exceed 30 characters',
    'any.required': 'Title is required',
  }),
  price: Joi.number().integer().required().messages({
    'number.base': 'Price must be a number',
    'number.integer': 'Price must be an integer',
    'any.required': 'Price is required',
  }),
  size: Joi.string().required().messages({
    'any.required': 'Size is required',
  }),
  producer: Joi.string().allow('').optional().messages({
    'string.base': 'Producer must be a string',
  }),
  model: Joi.string().required().messages({
    'any.required': 'Model is required',
  }),
  layering: Joi.string().allow('').messages({
    'string.base': 'Layering must be a string',
  }),
  loadIndex: Joi.string().allow('').messages({
    'string.base': 'LoadIndex must be a string',
  }),
  image: Joi.string().messages({
    'string.base': 'Image must be a string',
  }),
  tireType: Joi.string().valid('tl', 'ttf').allow('').optional().messages({
    'any.only': 'Tire type must be either "tl" or "ttf"',
  }), //.optional() ????????
  //   stock: Joi.number(), //кількість що залишилась
  instock: Joi.boolean(), //є в наявності
});

//при оновленні шини:
export const updateTireSchema = Joi.object({
  category: Joi.string()
    .valid('loader', 'industrial', 'agricultural', 'rims')
    .messages({
      'any.only':
        'Category must be one of: loader, industrial, agricultural, rims',
    }),
  title: Joi.string().min(3).max(30).messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title must not exceed 30 characters',
  }),
  price: Joi.number().integer().messages({
    'number.base': 'Price must be a number',
    'number.integer': 'Price must be an integer',
  }),
  size: Joi.string().messages({
    'string.base': 'Size must be a string',
  }),
  producer: Joi.string().allow('').optional().messages({
    'string.base': 'Producer must be a string',
  }),
  model: Joi.string().messages({
    'string.base': 'Model must be a string',
  }),
  layering: Joi.string().messages({
    'string.base': 'Layering must be a string',
  }),
  loadIndex: Joi.string().allow('').messages({
    'string.base': 'LoadIndex must be a string',
  }),
  tireType: Joi.string().valid('tl', 'ttf').allow('').optional().messages({
    'any.only': 'Tire type must be either "tl" or "ttf"',
  }),
  image: Joi.string().messages({
    'string.base': 'Image must be a string',
  }),
  //   stock: Joi.number(),
  instock: Joi.boolean(),
});
