import express from "express";
import { cancelAppointment, createAppointment, getAppointmentByID, getDoctorById, patientLogin, patientProfile, patientSignup, updatePatientProfile, viewAppointments, viewDoctors } from "../controllers/patientController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { logout } from "../controllers/doctorController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { validateCreateAppointment, validateLogin, validateMongoIdParam, validatePagination, validateSignup } from "../middlewares/validate.js";

const router = express.Router();

/**
 * @swagger
 * /patient/signup:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password, description: "Min 8 chars, upper+lower+number" }
 *               phone: { type: string }
 *               gender: { type: string }
 *     responses:
 *       201: { description: Patient created, returns a JWT }
 *       400: { description: Validation error, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       409: { description: Email already registered }
 */
router.post('/signup',authLimiter,validateSignup,patientSignup);

/**
 * @swagger
 * /patient/login:
 *   post:
 *     summary: Log in as a patient
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Returns a JWT }
 *       401: { description: Wrong password }
 *       404: { description: User not found }
 */
router.post('/login',authLimiter,validateLogin,patientLogin);

/**
 * @swagger
 * /patient/getDoctors:
 *   get:
 *     summary: List doctors (public, paginated, filterable)
 *     tags: [Patient]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: speciality
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string, description: "Filter by doctor name" }
 *     responses:
 *       200: { description: Paginated list of doctors }
 */
router.get('/getDoctors',validatePagination,viewDoctors);

router.use(requireAuth, requireRole("patient"))

/**
 * @swagger
 * /patient/profile:
 *   get:
 *     summary: Get the logged-in patient's profile
 *     tags: [Patient]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Patient profile }
 *       401: { description: Missing/invalid token }
 *   patch:
 *     summary: Update the logged-in patient's profile
 *     tags: [Patient]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender: { type: string }
 *               age: { type: string }
 *               pincode: { type: string }
 *               address: { type: string }
 *     responses:
 *       200: { description: Updated profile }
 */
router.get('/profile',patientProfile);
router.patch('/profile',updatePatientProfile);

/**
 * @swagger
 * /patient/getDoctor/{id}:
 *   get:
 *     summary: Get a single doctor by id
 *     tags: [Patient]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Doctor found }
 *       404: { description: Doctor not found }
 */
router.get('/getDoctor/:id',validateMongoIdParam('id'),getDoctorById);

/**
 * @swagger
 * /patient/create-appointment:
 *   post:
 *     summary: Book an appointment with a doctor
 *     tags: [Patient]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, date, time]
 *             properties:
 *               doctorId: { type: string }
 *               date: { type: string, format: date, example: "2026-09-10" }
 *               time: { type: string, example: "14:30" }
 *     responses:
 *       201: { description: Appointment created (status Pending) }
 *       400: { description: Missing/invalid or past date-time }
 *       404: { description: Doctor not found }
 *       409: { description: Time slot already booked }
 */
router.post('/create-appointment',validateCreateAppointment,createAppointment);

/**
 * @swagger
 * /patient/appointments:
 *   get:
 *     summary: List the logged-in patient's appointments
 *     tags: [Patient]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of appointments }
 */
router.get('/appointments',viewAppointments);

/**
 * @swagger
 * /patient/appointment/{id}:
 *   get:
 *     summary: Get a single appointment by id
 *     tags: [Patient]
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
 * /patient/appointment/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment (must be at least 2 hours before the scheduled time)
 *     tags: [Patient]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Appointment cancelled }
 *       400: { description: Already cancelled, or past the cancellation deadline }
 *       404: { description: Appointment not found }
 */
router.patch('/appointment/:id/cancel',validateMongoIdParam('id'),cancelAppointment);

/**
 * @swagger
 * /patient/logout:
 *   get:
 *     summary: Log out (client should also discard its token)
 *     tags: [Patient]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Logged out }
 */
router.get('/logout',logout);

export {router as patientRoute};
