import express from "express";
import { sendCertificateEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-email", sendCertificateEmail);

export default router;