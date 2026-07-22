import { Joi, Segments } from "celebrate";

export const createAvailabilitySchema = {
  [Segments.BODY]: Joi.object({
    startAt: Joi.date()
      .iso()
      .greater("now")
      .required(),
  }),
};

export const deleteAvailabilitySchema = {
  [Segments.PARAMS]: Joi.object({
    slotId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};