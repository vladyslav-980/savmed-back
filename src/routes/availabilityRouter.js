import { celebrate } from "celebrate";
import { Router } from "express";

import { createAvailability } from "../controllers/availability/createAvailability.js";
import { deleteAvailability } from "../controllers/availability/deleteAvailability.js";
import { getAvailableSlots } from "../controllers/availability/getAvailableSlots.js";
import {
  createAvailabilitySchema,
  deleteAvailabilitySchema,
} from "../validations/availability.js";

const availabilityRouter = Router();

availabilityRouter.get("/", getAvailableSlots);

availabilityRouter.post(
  "/",
  celebrate(createAvailabilitySchema),
  createAvailability,
);

availabilityRouter.delete(
  "/:slotId",
  celebrate(deleteAvailabilitySchema),
  deleteAvailability,
);

export default availabilityRouter;