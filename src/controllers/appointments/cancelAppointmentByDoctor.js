import mongoose from "mongoose";

import { Appointment } from "../../models/appointment.js";
import { Availability } from "../../models/availability.js";
import { sendEmail } from "../../services/emailService.js";
import {
  createClientAppointmentCancelledByDoctorEmail,
} from "../../templates/appointmentEmails.js";

export const cancelAppointmentByDoctor = async (
  req,
  res,
  next,
) => {
  const session = await mongoose.startSession();

  const notificationStatus = {
    client: false,
  };

  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    let cancelledAppointment;

    await session.withTransaction(async () => {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        status: "scheduled",
      }).session(session);

      if (!appointment) {
        const error = new Error(
          "Scheduled appointment not found",
        );

        error.status = 404;

        throw error;
      }

      if (appointment.availability) {
        await Availability.updateOne(
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
      }

      if (appointment.blockedAvailabilities.length > 0) {
        await Availability.updateMany(
          {
            _id: {
              $in: appointment.blockedAvailabilities,
            },
            status: "blocked",
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
      }

      appointment.status = "cancelled";
      appointment.cancelledAt = new Date();
      appointment.cancelledBy = "doctor";
      appointment.cancellationReason = reason;
      appointment.cancellationTokenHash = null;

      await appointment.save({
        session,
      });

      cancelledAppointment = appointment;
    });

    try {
      const clientEmailContent =
        createClientAppointmentCancelledByDoctorEmail({
          clientName: cancelledAppointment.clientName,
          type: cancelledAppointment.type,
          startAt: cancelledAppointment.startAt,
          endAt: cancelledAppointment.endAt,
          cancellationReason:
            cancelledAppointment.cancellationReason,
        });

      await sendEmail({
        to: cancelledAppointment.clientEmail,
        ...clientEmailContent,
      });

      notificationStatus.client = true;
    } catch (emailError) {
      console.error(
        "Doctor cancelled the appointment, but client email failed:",
        emailError.message,
      );
    }

    res.status(200).json({
      status: "success",
      message: "Appointment cancelled successfully",
      data: cancelledAppointment,
      notifications: notificationStatus,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};