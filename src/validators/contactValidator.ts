import Joi from 'joi';

export const contactSchema = Joi.object({
    name: Joi.string().required().min(1).max(100),
    birthdate: Joi.date().required(),
  });
