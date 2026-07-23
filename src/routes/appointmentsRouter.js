import { celebrate } from "celebrate";
import { Router } from "express";

import { cancelAppointmentByClient } from "../controllers/appointments/cancelAppointmentByClient.js";
import { createAppointmentByDoctor } from "../controllers/appointments/createAppointmentByDoctor.js";
import { cancelAppointmentByDoctor } from "../controllers/appointments/cancelAppointmentByDoctor.js";
import { createConsultation } from "../controllers/appointments/createConsultation.js";
import { getAdminAppointments } from "../controllers/appointments/getAdminAppointments.js";
import { completeAppointment } from "../controllers/appointments/completeAppointment.js";
import { authenticateDoctor } from "../middlewares/authenticateDoctor.js";
import {
  cancelAppointmentSchema,
  createAppointmentByDoctorSchema,
  createConsultationSchema,
  getAdminAppointmentsSchema,
  cancelAppointmentByDoctorSchema,
  completeAppointmentSchema,
} from "../validations/appointments.js";

const appointmentsRouter = Router();

appointmentsRouter.post(
  "/consultations",
  celebrate(createConsultationSchema),
  createConsultation,
);

appointmentsRouter.patch(
  "/cancel",
  celebrate(cancelAppointmentSchema),
  cancelAppointmentByClient,
);

appointmentsRouter.get(
  "/admin",
  authenticateDoctor,
  celebrate(getAdminAppointmentsSchema),
  getAdminAppointments,
);

appointmentsRouter.post(
  "/admin",
  authenticateDoctor,
  celebrate(createAppointmentByDoctorSchema),
  createAppointmentByDoctor,
);

appointmentsRouter.patch(
  "/admin/:appointmentId/cancel",
  authenticateDoctor,
  celebrate(cancelAppointmentByDoctorSchema),
  cancelAppointmentByDoctor,
);

appointmentsRouter.patch(
  "/admin/:appointmentId/complete",
  authenticateDoctor,
  celebrate(completeAppointmentSchema),
  completeAppointment,
);

export default appointmentsRouter;