import { sendEmail } from "../services/emailService.js";

export const sendCertificateEmail = async (req, res) => {
  try {
    const { name, email, certificateId, pdf } = req.body;

    // ✅ VALIDATION
    if (!email || !pdf) {
      return res.status(400).json({
        success: false,
        message: "Email and PDF are required",
      });
    }

    console.log("📤 EMAIL REQUEST INITIATED");
    console.log("➡ To:", email);
    console.log("➡ Certificate ID:", certificateId);

    // ✅ CALL EMAIL SERVICE
    const result = await sendEmail({
      to: email,
      subject: "🎓 Your Certificate",
      text: `Hello ${name}, your certificate is attached. Please check your inbox.`,
      pdf,
      filename: `Certificate_${certificateId}.pdf`,
    });

    // ✅ STRONG SUCCESS LOGGING
    console.log("✅ EMAIL PROCESS COMPLETED");
    console.log("📩 Message ID:", result?.messageId || "N/A");

    return res.status(200).json({
      success: true,
      message: "Email sent successfully (check inbox/spam)",
      messageId: result?.messageId || null,
    });

  } catch (error) {
    console.error("❌ EMAIL CONTROLLER ERROR:");
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });
  }
};