import {
  createHash,
  randomBytes,
} from "node:crypto";
import mongoose from "mongoose";

import { Appointment } from "../../models/appointment.js";
import { Availability } from "../../models/availability.js";
import { sendEmail } from "../../services/emailService.js";
import {
  createClientAppointmentEmail,
  createDoctorAppointmentEmail,
} from "../../templates/appointmentEmails.js";

export const createConsultation = async (
  req,
  res,
  next,
) => {
  const session = await mongoose.startSession();

  let appointment;
  let cancellationToken;

  const notificationStatus = {
    client: false,
    doctor: false,
  };

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

    try {
      const clientEmailContent =
        createClientAppointmentEmail({
          clientName,
          type: appointment.type,
          startAt: appointment.startAt,
          endAt: appointment.endAt,
          cancellationToken,
        });

      const doctorEmailContent =
        createDoctorAppointmentEmail({
          clientName,
          clientPhone,
          clientEmail,
          type: appointment.type,
          startAt: appointment.startAt,
          endAt: appointment.endAt,
        });

      const [clientEmailResult, doctorEmailResult] =
        await Promise.allSettled([
          sendEmail({
            to: clientEmail,
            ...clientEmailContent,
          }),
          sendEmail({
            to: process.env.DOCTOR_EMAIL,
            ...doctorEmailContent,
          }),
        ]);

      notificationStatus.client =
        clientEmailResult.status === "fulfilled";

      notificationStatus.doctor =
        doctorEmailResult.status === "fulfilled";

      if (clientEmailResult.status === "rejected") {
        console.error(
          "Client email sending failed:",
          clientEmailResult.reason?.message,
        );
      }

      if (doctorEmailResult.status === "rejected") {
        console.error(
          "Doctor email sending failed:",
          doctorEmailResult.reason?.message,
        );
      }
    } catch (emailError) {
      console.error(
        "Appointment was created, but email preparation failed:",
        emailError.message,
      );
    }

    res.status(201).json({
      status: "success",
      data: appointment,
      notifications: notificationStatus,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};