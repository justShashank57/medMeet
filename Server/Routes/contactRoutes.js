import express from "express";
import { submitContactMessage } from "../controllers/contactController.js";
import { formLimiter } from "../middlewares/rateLimiter.js";
import { validateContact } from "../middlewares/validate.js";

const router = express.Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Send a message via the contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               subject: { type: string }
 *               message: { type: string }
 *     responses:
 *       201: { description: Message received }
 *       400: { description: Validation error }
 */
router.post('/',formLimiter,validateContact,submitContactMessage);

export {router as contactRoute};
