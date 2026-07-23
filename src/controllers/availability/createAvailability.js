import { Availability } from "../../models/availability.js";
import { Appointment } from "../../models/appointment.js";

const SLOT_DURATION_MS = 30 * 60 * 1000;

export const createAvailability = async (req, res, next) => {
  try {
    const startAt = new Date(req.body.startAt);

    if (Number.isNaN(startAt.getTime())) {
      const error = new Error("Invalid start date");
      error.status = 400;
      throw error;
    }

    if (startAt <= new Date()) {
      const error = new Error("Start date must be in the future");
      error.status = 400;
      throw error;
    }

    const endAt = new Date(
      startAt.getTime() + SLOT_DURATION_MS,
    );

    const overlappingSlot = await Availability.findOne({
      startAt: { $lt: endAt },
      endAt: { $gt: startAt },
    });

    if (overlappingSlot) {
      const error = new Error(
        "This time overlaps with another slot",
      );
      error.status = 409;
      throw error;
    }

    const overlappingAppointment =
  await Appointment.findOne({
    status: "scheduled",
    startAt: {
      $lt: endAt,
    },
    endAt: {
      $gt: startAt,
    },
  });

if (overlappingAppointment) {
  const error = new Error(
    "This time overlaps with a scheduled appointment",
  );
  error.status = 409;
  throw error;
}

    const slot = await Availability.create({
      startAt,
      endAt,
    });

    res.status(201).json({
      status: "success",
      data: slot,
    });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.message = "A slot with this start time already exists";
    }

    next(error);
  }
};