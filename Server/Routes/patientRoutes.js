import express from "express";
import { createAppointment, getAppointmentByID, getDoctorById, patientLogin, patientProfile, patientSignup, updatePatientProfile, viewAppointments, viewDoctors } from "../controllers/patientController.js";
import { requireAuth } from "../middlewares/auth.js";
import { logout } from "../controllers/doctorController.js";

const router = express.Router();
// --------------------------------SignUp----------------------------
router.post('/signup',patientSignup);
// --------------------------------Login----------------------------
router.post('/login',patientLogin);

// --------------------------------view doctors----------------------------
router.get('/getDoctors',viewDoctors);

router.use(requireAuth)
// --------------------------------view Profile----------------------------
router.get('/profile',patientProfile);
// --------------------------------update Profile----------------------------
router.patch('/profile',updatePatientProfile);
// --------------------------------view doctors by id--------------------------
router.get('/getDoctor/:id',getDoctorById);
// --------------------------------create appointment--------------------------
router.post('/create-appointment',createAppointment);
// --------------------------------view appointments--------------------------
router.get('/appointments',viewAppointments);
// --------------------------------view appointment by ID--------------------------x
router.get('/appointment/:id',getAppointmentByID);
// --------------------------------Logout--------------------------x
router.get('/logout',logout);

export {router as patientRoute};