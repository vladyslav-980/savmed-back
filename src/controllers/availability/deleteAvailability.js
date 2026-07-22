import { Availability } from "../../models/availability.js";

export const deleteAvailability = async (
  req,
  res,
  next,
) => {
  try {
    const { slotId } = req.params;

    const slot = await Availability.findById(slotId);

    if (!slot) {
      const error = new Error("Availability slot not found");
      error.status = 404;
      throw error;
    }

    if (slot.status === "booked") {
      const error = new Error(
        "A booked slot cannot be deleted",
      );
      error.status = 409;
      throw error;
    }

    await slot.deleteOne();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};