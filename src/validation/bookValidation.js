import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};
export const bookIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    bookId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getBooksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    category: Joi.string().valid(
      'hystory',
      'mystery',
      'romance',
      'adventure',
      'biography',
    ),
    search: Joi.string().trim().allow(''),
  }),
};

export const createBookSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name should have at least {#limit} characters',
      'string.max': 'Name should have at most {#limit} characters',
      'any.required': 'Name is required',
    }),
    category: Joi.string()
      .valid('hystory', 'mystery', 'romance', 'adventure', 'biography')
      .required(),
  }),
};

export const updateBookSchema = {
  [Segments.PARAMS]: Joi.object({
    bookId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(30).messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name should have at least {#limit} characters',
      'string.max': 'Name should have at most {#limit} characters',
    }),
    category: Joi.string().valid(
      'hystory',
      'mystery',
      'romance',
      'adventure',
      'biography',
    ),
  }).min(1),
};
