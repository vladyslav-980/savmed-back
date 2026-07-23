import { Appointment } from "../../models/appointment.js";

export const completeAppointment = async (
  req,
  res,
  next,
) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      status: "scheduled",
    }).select("+cancellationTokenHash");

    if (!appointment) {
      const error = new Error(
        "Scheduled appointment not found",
      );
      error.status = 404;
      throw error;
    }

    if (appointment.startAt > new Date()) {
      const error = new Error(
        "A future appointment cannot be completed",
      );
      error.status = 409;
      throw error;
    }

    appointment.status = "completed";
    appointment.cancellationTokenHash = null;

    await appointment.save();

    res.status(200).json({
      status: "success",
      message: "Appointment completed successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};