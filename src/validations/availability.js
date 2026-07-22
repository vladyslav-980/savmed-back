import { Joi, Segments } from "celebrate";

export const createAvailabilitySchema = {
  [Segments.BODY]: Joi.object({
    startAt: Joi.date()
      .iso()
      .greater("now")
      .required(),
  }),
};