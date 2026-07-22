import { Joi, Segments } from "celebrate";

export const createConsultationSchema = {
  [Segments.BODY]: Joi.object({
    slotId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),

    clientName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    clientPhone: Joi.string()
      .trim()
      .pattern(/^\+?[0-9\s()-]{10,20}$/)
      .required(),

    clientEmail: Joi.string()
      .trim()
      .email()
      .required(),
  }),
};

export const cancelAppointmentSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string()
      .pattern(/^[0-9a-fA-F]{64}$/)
      .required(),

    reason: Joi.string()
      .trim()
      .max(500)
      .allow("")
      .default(""),
  }),
};