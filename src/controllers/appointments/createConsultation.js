import {
  createHash,
  randomBytes,
} from "node:crypto";
import mongoose from "mongoose";

import { Appointment } from "../../models/appointment.js";
import { Availability } from "../../models/availability.js";

export const createConsultation = async (
  req,
  res,
  next,
) => {
  const session = await mongoose.startSession();

  let appointment;
  let cancellationToken;

  try {
    const {
      slotId,
      clientName,
      clientPhone,
      clientEmail,
    } = req.body;

    await session.withTransaction(async () => {
      const slot = await Availability.findOneAndUpdate(
        {
          _id: slotId,
          status: "available",
          startAt: {
            $gt: new Date(),
          },
        },
        {
          $set: {
            status: "booked",
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!slot) {
        const error = new Error(
          "This consultation time is no longer available",
        );
        error.status = 409;
        throw error;
      }

      cancellationToken = randomBytes(32).toString("hex");

      const cancellationTokenHash = createHash("sha256")
        .update(cancellationToken)
        .digest("hex");

      const createdAppointments = await Appointment.create(
        [
          {
            type: "consultation",
            createdBy: "client",
            startAt: slot.startAt,
            endAt: slot.endAt,
            clientName,
            clientPhone,
            clientEmail,
            availability: slot._id,
            cancellationTokenHash,
          },
        ],
        {
          session,
        },
      );

      appointment = createdAppointments[0];

      slot.appointment = appointment._id;

      await slot.save({
        session,
      });
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