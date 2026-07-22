import { Availability } from "../../models/availability.js";

export const getAvailableSlots = async (req, res, next) => {
  try {
    const slots = await Availability.find({
      status: "available",
      startAt: {
        $gt: new Date(),
      },
    }).sort({
      startAt: 1,
    });

    res.status(200).json({
      status: "success",
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};