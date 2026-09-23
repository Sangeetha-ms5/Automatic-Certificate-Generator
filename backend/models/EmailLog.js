import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      index: true, // helps search logs faster
    },

    certificateId: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Delivered", "Failed"],
      default: "Pending",
      index: true,
    },

    // 🔥 NEW: real email tracking info
    messageId: {
      type: String, // from nodemailer or resend
      default: null,
    },

    errorMessage: {
      type: String, // store actual failure reason
      default: null,
    },

    provider: {
      type: String,
      default: "gmail-smtp", // helps if you later switch to resend/sendgrid
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EmailLog", EmailLogSchema);