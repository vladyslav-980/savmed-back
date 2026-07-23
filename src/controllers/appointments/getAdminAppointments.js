import { Appointment } from "../../models/appointment.js";

export const getAdminAppointments = async (
  req,
  res,
  next,
) => {
  try {
    const {
      type,
      status,
      from,
      to,
    } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    if (from || to) {
      filter.startAt = {};

      if (from) {
        filter.startAt.$gte = new Date(from);
      }

      if (to) {
        filter.startAt.$lte = new Date(to);
      }
    }

    const appointments = await Appointment.find(
      filter,
    ).sort({
      startAt: 1,
    });

    res.status(200).json({
      status: "success",
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};