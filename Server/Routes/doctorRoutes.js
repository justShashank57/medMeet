import express from "express";
import { confirmAppointment, doctorLogin, doctorProfile, doctorSignup, getAppointments, logout, updateAppointmentStatus, updateProfile, updateService } from "../controllers/doctorController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { getAppointmentByID } from "../controllers/patientController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { validateDoctorSignup, validateLogin, validateMongoIdParam } from "../middlewares/validate.js";

const router = express.Router();

/**
 * @swagger
 * /doctor/signup:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone, gender]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               phone: { type: string }
 *               gender: { type: string }
 *     responses:
 *       201: { description: Doctor created, returns a JWT }
 *       409: { description: Email already registered }
 */
router.post('/signup',authLimiter,validateDoctorSignup,doctorSignup);

/**
 * @swagger
 * /doctor/login:
 *   post:
 *     summary: Log in as a doctor
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Returns a JWT }
 *       401: { description: Wrong password }
 *       404: { description: User not found }
 */
router.post('/login',authLimiter,validateLogin,doctorLogin);

router.use(requireAuth, requireRole("doctor"));

/**
 * @swagger
 * /doctor/profile:
 *   get:
 *     summary: Get the logged-in doctor's profile
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Doctor profile }
 *   patch:
 *     summary: Update the logged-in doctor's profile
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated profile }
 */
router.get('/profile',doctorProfile);
router.patch('/profile',updateProfile);

/**
 * @swagger
 * /doctor/service:
 *   get:
 *     summary: Toggle the doctor's availability flag
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated doctor record }
 */
router.get('/service',updateService);

/**
 * @swagger
 * /doctor/confirm-appointment/{id}:
 *   get:
 *     summary: Toggle confirmation on one of the doctor's own appointments
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated appointment }
 *       404: { description: Appointment not found }
 */
router.get('/confirm-appointment/:id',validateMongoIdParam('id'),confirmAppointment);

/**
 * @swagger
 * /doctor/appointments:
 *   get:
 *     summary: List the logged-in doctor's appointments
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of appointments }
 */
router.get('/appointments',getAppointments);

/**
 * @swagger
 * /doctor/update-status:
 *   post:
 *     summary: Update the status/notes of one of the doctor's own appointments
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [appointmentId, status]
 *             properties:
 *               appointmentId: { type: string }
 *               status: { type: string, example: Confirmed }
 *               notes: { type: string }
 *     responses:
 *       200: { description: Updated appointment }
 *       404: { description: Appointment not found }
 */
router.post('/update-status',updateAppointmentStatus);

/**
 * @swagger
 * /doctor/appointment/{id}:
 *   get:
 *     summary: Get a single appointment by id
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Appointment found }
 *       404: { description: Not found }
 */
router.get('/appointment/:id',validateMongoIdParam('id'),getAppointmentByID);

/**
 * @swagger
 * /doctor/logout:
 *   get:
 *     summary: Log out (client should also discard its token)
 *     tags: [Doctor]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Logged out }
 */
router.get('/logout',logout);



export {router as doctorRoute};
