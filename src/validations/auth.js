import { Joi, Segments } from "celebrate";

export const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .required(),

    password: Joi.string()
      .min(8)
      .max(128)
      .required(),
  }),
};