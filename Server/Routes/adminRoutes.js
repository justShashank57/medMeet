import express from "express";
import { createDoctor, deleteDoctor, getDoctor, getDoctors } from "../controllers/adminController.js";
import { requireAdminKey } from "../middlewares/requireAdminKey.js";
import { validateDoctorSignup, validateMongoIdParam, validatePagination } from "../middlewares/validate.js";

const router = express.Router();

/**
 * @swagger
 * /admin/doctor/{id}:
 *   get:
 *     summary: Get a doctor by id
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Doctor found }
 *       404: { description: Doctor not found }
 *   delete:
 *     summary: Delete a doctor
 *     tags: [Admin]
 *     security: [{ adminKey: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Doctor deleted }
 *       401: { description: Invalid or missing admin key }
 *       404: { description: Doctor not found }
 */
router.get('/doctor/:id',validateMongoIdParam('id'),getDoctor);

/**
 * @swagger
 * /admin/doctors:
 *   get:
 *     summary: List doctors (paginated, filterable)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated list of doctors }
 */
router.get('/doctors',validatePagination,getDoctors);

/**
 * @swagger
 * /admin/doctor:
 *   post:
 *     summary: Create a doctor
 *     tags: [Admin]
 *     security: [{ adminKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone, gender]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               gender: { type: string }
 *               speciality: { type: string }
 *               pincode: { type: string }
 *               address: { type: string }
 *               hospital: { type: string }
 *     responses:
 *       201: { description: Doctor created }
 *       401: { description: Invalid or missing admin key }
 *       409: { description: Email already registered }
 */
router.post('/doctor',requireAdminKey,validateDoctorSignup,createDoctor);
router.delete('/doctor/:id',requireAdminKey,validateMongoIdParam('id'),deleteDoctor);

export {router as adminRoute};
