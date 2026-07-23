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

export const createAppointmentByDoctorSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string()
      .valid("consultation", "treatment")
      .required(),

    startAt: Joi.date()
      .iso()
      .greater("now")
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

    notes: Joi.string()
      .trim()
      .max(1000)
      .allow("")
      .default(""),
  }),
};

export const getAdminAppointmentsSchema = {
  [Segments.QUERY]: Joi.object({
    type: Joi.string()
      .valid("consultation", "treatment")
      .optional(),

    status: Joi.string()
      .valid("scheduled", "completed", "cancelled")
      .optional(),

    from: Joi.date()
      .iso()
      .optional(),

    to: Joi.date()
      .iso()
      .optional(),
  }),
};

export const cancelAppointmentByDoctorSchema = {
  [Segments.PARAMS]: Joi.object({
    appointmentId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  [Segments.BODY]: Joi.object({
    reason: Joi.string()
      .trim()
      .max(500)
      .allow("")
      .default(""),
  }),
};

export const completeAppointmentSchema = {
  [Segments.PARAMS]: Joi.object({
    appointmentId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};