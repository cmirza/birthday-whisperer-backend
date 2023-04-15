import Joi from 'joi';

export const objectIdValidator = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
