import { celebrate } from "celebrate";
import { Router } from "express";

import { cancelAppointmentByClient } from "../controllers/appointments/cancelAppointmentByClient.js";
import { createConsultation } from "../controllers/appointments/createConsultation.js";
import {
  cancelAppointmentSchema,
  createConsultationSchema,
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

export default appointmentsRouter;