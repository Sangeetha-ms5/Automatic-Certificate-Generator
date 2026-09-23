import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json({ limit: "50mb" }));

/* ================= MODELS ================= */

const UserData = mongoose.model(
  "UserData",
  new mongoose.Schema(
    {
      participantName: String,
      eventName: String,
      organization: String,
      date: String,
      email: String,
      certificateId: String,
      type: String,
    },
    { timestamps: true }
  )
);

const Event = mongoose.model(
  "Event",
  new mongoose.Schema(
    {
      name: String,
      certificateType: String,
      date: String,
      participants: Number,
      status: { type: String, default: "active" },
    },
    { timestamps: true }
  )
);

const EmailLog = mongoose.model(
  "EmailLog",
  new mongoose.Schema(
    {
      name: String,
      email: String,
      certificateId: String,
      status: {
        type: String,
        enum: ["Pending", "Delivered", "Failed"],
        default: "Pending",
      },
    },
    { timestamps: true }
  )
);

/* ================= EMAIL CONFIG ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) console.log("❌ Gmail SMTP FAILED", error.message);
  else console.log("✅ Gmail SMTP Connected");
});

/* ================= HOME ================= */
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

/* ================= USER DATA ================= */

// CREATE
app.post("/api/user-data", async (req, res) => {
  try {
    const data = await UserData.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ FIXED: GET ALL USER DATA */
app.get("/api/user-data", async (req, res) => {
  try {
    const data = await UserData.find({})
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      error: err.message
    });
  }
});

/* ================= DELETE ================= */
app.delete("/api/user-data/:id", async (req, res) => {
  try {
    await UserData.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted permanently" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= EVENTS ================= */

app.post("/api/events", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= EMAIL ================= */

app.post("/api/send-email", async (req, res) => {
  try {
    const { name, email, certificateId, pdf } = req.body;

    const log = await EmailLog.create({
      name,
      email,
      certificateId,
      status: "Pending",
    });

    await transporter.sendMail({
      from: `"Certificate System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎓 Your Certificate",
      text: `Hello ${name}, your certificate is attached.`,
      attachments: [
        {
          filename: `Certificate_${certificateId}.pdf`,
          content: pdf.split("base64,")[1],
          encoding: "base64",
        },
      ],
    });

    log.status = "Delivered";
    await log.save();

    res.json({ success: true });
  } catch (error) {
    console.log("❌ EMAIL ERROR:", error.message);
    res.status(500).json({ success: false });
  }
});

/* ================= STATS ================= */

app.get("/api/stats/total-certificates", async (req, res) => {
  const count = await UserData.countDocuments();
  res.json({ totalCertificates: count });
});

app.get("/api/stats/events", async (req, res) => {
  const count = await Event.countDocuments({ status: "active" });
  res.json({ activeEvents: count });
});

app.get("/api/stats/participants", async (req, res) => {
  const users = await UserData.distinct("email");
  res.json({ totalParticipants: users.length });
});

app.get("/api/stats/emails", async (req, res) => {
  const emailsSent = await EmailLog.countDocuments();
  const delivered = await EmailLog.countDocuments({ status: "Delivered" });
  const failed = await EmailLog.countDocuments({ status: "Failed" });
  const pending = await EmailLog.countDocuments({ status: "Pending" });

  res.json({ emailsSent, delivered, failed, pending });
});

/* ================= FIXED RECENT ACTIVITY ================= */

app.get("/api/stats/recent", async (req, res) => {
  try {
    const data = await UserData.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      data: data || []
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      error: err.message
    });
  }
});

/* ================= EMAIL LOGS ================= */

app.get("/api/email-logs", async (req, res) => {
  const logs = await EmailLog.find().sort({ createdAt: -1 });
  res.json({ logs });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);