import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    // Event Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Certificate Type
    type: {
      type: String,
      required: true,
      enum: ["Participation", "Achievement", "Appreciation", "Completion"],
      default: "Participation",
    },

    // Event Date
    date: {
      type: Date,
      required: true,
    },

    // Number of Participants
    participants: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", EventSchema);