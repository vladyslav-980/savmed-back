import {
  createHash,
  randomBytes,
} from "node:crypto";
import mongoose from "mongoose";

import { Appointment } from "../../models/appointment.js";
import { Availability } from "../../models/availability.js";

const DURATION_BY_TYPE = {
  consultation: 30,
  treatment: 120,
};

const MINUTE_MS = 60 * 1000;

export const createAppointmentByDoctor = async (
  req,
  res,
  next,
) => {
  const session = await mongoose.startSession();

  let appointment;
  let cancellationToken;

  try {
    const {
      type,
      startAt: startAtValue,
      clientName,
      clientPhone,
      clientEmail,
      notes,
    } = req.body;

    const startAt = new Date(startAtValue);

    const durationMinutes = DURATION_BY_TYPE[type];

    const endAt = new Date(
      startAt.getTime() + durationMinutes * MINUTE_MS,
    );

    await session.withTransaction(async () => {
      const overlappingAppointment =
        await Appointment.findOne({
          status: "scheduled",
          startAt: {
            $lt: endAt,
          },
          endAt: {
            $gt: startAt,
          },
        }).session(session);

      if (overlappingAppointment) {
        const error = new Error(
          "This time overlaps with another appointment",
        );
        error.status = 409;
        throw error;
      }

      const conflictingAvailability =
        await Availability.findOne({
          status: {
            $in: ["booked", "blocked"],
          },
          startAt: {
            $lt: endAt,
          },
          endAt: {
            $gt: startAt,
          },
        }).session(session);

      if (conflictingAvailability) {
        const error = new Error(
          "This time conflicts with an unavailable slot",
        );
        error.status = 409;
        throw error;
      }

      const availableSlots = await Availability.find({
        status: "available",
        startAt: {
          $lt: endAt,
        },
        endAt: {
          $gt: startAt,
        },
      }).session(session);

      cancellationToken = randomBytes(32).toString("hex");

      const cancellationTokenHash = createHash("sha256")
        .update(cancellationToken)
        .digest("hex");

      const createdAppointments = await Appointment.create(
        [
          {
            type,
            createdBy: "doctor",
            startAt,
            endAt,
            clientName,
            clientPhone,
            clientEmail,
            notes,
            cancellationTokenHash,
            blockedAvailabilities: availableSlots.map(
              (slot) => slot._id,
            ),
          },
        ],
        {
          session,
        },
      );

      appointment = createdAppointments[0];

      if (availableSlots.length > 0) {
        await Availability.updateMany(
          {
            _id: {
              $in: availableSlots.map(
                (slot) => slot._id,
              ),
            },
            status: "available",
          },
          {
            $set: {
              status: "blocked",
              appointment: appointment._id,
            },
          },
          {
            session,
          },
        );
      }
    });

    res.status(201).json({
      status: "success",
      data: appointment,
      cancellationToken,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};