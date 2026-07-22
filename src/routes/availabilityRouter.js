import { celebrate } from "celebrate";
import { Router } from "express";

import { createAvailability } from "../controllers/availability/createAvailability.js";
import { createAvailabilitySchema } from "../validations/availability.js";

const availabilityRouter = Router();

availabilityRouter.post(
  "/",
  celebrate(createAvailabilitySchema),
  createAvailability,
);

export default availabilityRouter;