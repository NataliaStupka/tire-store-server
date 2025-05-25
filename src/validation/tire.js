import Joi from 'joi';

//створенні нової шини:
// .allow('') Дозволяє порожні значення,
export const createTireSchema = Joi.object({
  category: Joi.string()
    .valid('loader', 'industrial', 'agricultural', 'rims')
    .required()
    .messages({
      'any.required': 'Category is required',
      'any.only':
        'Category must be one of: loader, industrial, agricultural, rims',
    }),
  title: Joi.string().valid('tire', 'rims').required().messages({
    'any.required': 'Title is required',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'any.required': 'Price is required',
  }),
  size: Joi.string().required().messages({
    'any.required': 'Size is required',
  }), //
  producer: Joi.string().allow('').optional().messages({
    'string.base': 'Producer must be a string',
  }), //
  modelTire: Joi.string().allow('').optional().messages({
    'any.required': 'Model is string',
  }), //
  layering: Joi.string().allow('').optional().messages({
    'string.base': 'Layering must be a string',
  }),
  loadIndex: Joi.string().allow('').optional().messages({
    'string.base': 'LoadIndex must be a string',
  }), //
  image: Joi.string().optional().messages({
    'string.base': 'Image must be a string',
  }),
  tireType: Joi.string()
    .valid('tl', 'tt', '')
    .when('title', {
      is: 'tire',
      then: Joi.string().valid('tt', 'tl').required(),
      otherwise: Joi.string().valid('').optional(),
    })
    .messages({
      'any.only': 'Tire type must be either "tl" or "tt"', //???
    }),
  //   stock: Joi.number(), //кількість що залишилась
  //   diskDiameter: Joi.number().messages({
  //     'number.base': 'DiskDiameter must be a number',
  //   }),
  diskModel: Joi.string().allow('').optional().messages({
    'string.base': 'DiskModel must be a string',
  }),
  //   instock: Joi.boolean(), //є в наявності
  instock: Joi.string().valid('true', 'false').required(),
}).unknown(true); // Дозволяємо додаткові поля (наприклад, image);

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
  modelTire: Joi.string().messages({
    'string.base': 'Model must be a string',
  }),
  layering: Joi.string().messages({
    'string.base': 'Layering must be a string',
  }),
  loadIndex: Joi.string().allow('').messages({
    'string.base': 'LoadIndex must be a string',
  }),
  tireType: Joi.string().valid('tl', 'tt').allow('').optional().messages({
    'any.only': 'Tire type must be either "tl" or "tt"',
  }),
  image: Joi.string().messages({
    'string.base': 'Image must be a string',
  }),
  //   diskDiameter: Joi.number().messages({
  //     'number.base': 'DiskDiameter must be a number',
  //   }),
  diskModel: Joi.string().allow('').messages({
    'string.base': 'DiskModel must be a string',
  }),
  //   stock: Joi.number(),
  instock: Joi.boolean(),
});
