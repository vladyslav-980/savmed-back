import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["consultation", "treatment"],
      required: true,
    },

    createdBy: {
      type: String,
      enum: ["client", "doctor"],
      required: true,
    },

    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
      required: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },

    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
      required: true,
    },

    availability: {
      type: Schema.Types.ObjectId,
      ref: "Availability",
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    cancellationTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelledBy: {
      type: String,
      enum: ["client", "doctor", null],
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

appointmentSchema.index({
  startAt: 1,
  endAt: 1,
  status: 1,
});

export const Appointment = model(
  "Appointment",
  appointmentSchema,
);