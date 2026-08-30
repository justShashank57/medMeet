import nodemailer from "nodemailer";
import { config } from "../config.js";
import { logger } from "./logger.js";

const isConfigured = Boolean(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: Number(config.SMTP_PORT) || 587,
      secure: Number(config.SMTP_PORT) === 465,
      auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
    })
  : null;

// Best-effort send: never throws, so a missing/broken mail server never blocks a booking.
export const sendMail = async ({ to, subject, html }) => {
  if (!isConfigured) {
    logger.debug(`[mailer] SMTP not configured, skipping email to ${to}: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: config.MAIL_FROM, to, subject, html });
  } catch (err) {
    logger.error("Failed to send email", { to, subject, error: err.message });
  }
};

export const sendAppointmentBookedEmail = (patientEmail, { doctorName, date, time }) =>
  sendMail({
    to: patientEmail,
    subject: "Appointment request received",
    html: `<p>Your appointment request with Dr. ${doctorName} on ${date} at ${time} has been received and is pending confirmation.</p>`,
  });

export const sendAppointmentStatusEmail = (patientEmail, { doctorName, date, time, status }) =>
  sendMail({
    to: patientEmail,
    subject: `Appointment ${status.toLowerCase()}`,
    html: `<p>Your appointment with Dr. ${doctorName} on ${date} at ${time} is now <strong>${status}</strong>.</p>`,
  });
