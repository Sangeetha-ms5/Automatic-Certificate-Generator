import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema(
  {
    participantName: String,
    eventName: String,
    organization: String,
    date: String,
    email: String,
    certificateId: String,
    type: String,

    // ✅ ADD THIS FIELD (IMPORTANT FOR DELETE + UNDO)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", userDataSchema);

export default UserData;