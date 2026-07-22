import { createHash } from "node:crypto";
import mongoose from "mongoose";

import { Appointment } from "../../models/appointment.js";
import { Availability } from "../../models/availability.js";

export const cancelAppointmentByClient = async (
  req,
  res,
  next,
) => {
  const session = await mongoose.startSession();

  try {
    const { token, reason } = req.body;

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    let cancelledAppointment;

    await session.withTransaction(async () => {
      const appointment = await Appointment.findOne({
        cancellationTokenHash: tokenHash,
        status: "scheduled",
      })
        .select("+cancellationTokenHash")
        .session(session);

      if (!appointment) {
        const error = new Error(
          "Cancellation token is invalid or has already been used",
        );
        error.status = 404;
        throw error;
      }

      if (appointment.startAt <= new Date()) {
        const error = new Error(
          "An appointment that has already started cannot be cancelled",
        );
        error.status = 409;
        throw error;
      }

      appointment.status = "cancelled";
      appointment.cancelledAt = new Date();
      appointment.cancelledBy = "client";
      appointment.cancellationReason = reason;
      appointment.cancellationTokenHash = null;

      await appointment.save({
        session,
      });

      if (appointment.availability) {
        const updateResult = await Availability.updateOne(
          {
            _id: appointment.availability,
            status: "booked",
            appointment: appointment._id,
          },
          {
            $set: {
              status: "available",
              appointment: null,
            },
          },
          {
            session,
          },
        );

        if (updateResult.matchedCount !== 1) {
          const error = new Error(
            "The related availability slot could not be restored",
          );
          error.status = 409;
          throw error;
        }
      }

      cancelledAppointment = appointment;
    });

    res.status(200).json({
      status: "success",
      message: "Appointment cancelled successfully",
      data: cancelledAppointment,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};