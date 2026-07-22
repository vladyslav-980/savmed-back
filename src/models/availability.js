import { Schema, model } from "mongoose";

const availabilitySchema = new Schema(
  {
    startAt: {
      type: Date,
      required: true,
      unique: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "blocked"],
      default: "available",
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Availability = model("Availability", availabilitySchema);