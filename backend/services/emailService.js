import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ================= OPTIMIZED GMAIL TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,              // ✅ FIX: use 587 (more stable than 465)
  secure: false,          // ✅ FIX: TLS starts after connection

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be Gmail App Password
  },

  tls: {
    rejectUnauthorized: false, // prevents SSL issues
  },

  pool: true,              // ✅ keeps connection alive (FASTER emails)
  maxConnections: 5,
  maxMessages: 100,
});

/* ================= VERIFY CONNECTION ================= */

transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP CONNECTION FAILED:");
    console.log(error.message);
  } else {
    console.log("✅ Gmail SMTP READY - EMAIL SYSTEM ACTIVE");
  }
});

/* ================= SEND EMAIL FUNCTION ================= */

export const sendEmail = async ({ to, subject, text, pdf, filename }) => {
  try {
    console.log("📤 Sending email to:", to);

    // ✅ FIX: clean base64 safely
    const cleanPdf =
      pdf && pdf.includes("base64,")
        ? pdf.split("base64,")[1]
        : pdf;

    const mailOptions = {
      from: `"Certificate System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,

      attachments: cleanPdf
        ? [
            {
              filename: filename || "certificate.pdf",
              content: cleanPdf,
              encoding: "base64",
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);

    // ✅ IMPORTANT DEBUG INFO
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("📩 Message ID:", info.messageId);
    console.log("📩 Accepted:", info.accepted);
    console.log("📩 Rejected:", info.rejected);

    // ❗ safety check
    if (!info.accepted || info.accepted.length === 0) {
      throw new Error("Email not accepted by Gmail server");
    }

    return info;

  } catch (error) {
    console.log("❌ EMAIL FAILED:");
    console.log(error.message);
    throw error;
  }
};

export default transporter;