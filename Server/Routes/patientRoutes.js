import express from "express";
import { createAppointment, getDoctorById, patientLogin, patientProfile, patientSignup, updatePatientProfile, viewDoctors } from "../controllers/patientController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();
// --------------------------------SignUp----------------------------
router.post('/signup',patientSignup);
// --------------------------------Login----------------------------
router.post('/login',patientLogin);

router.use(requireAuth)
// --------------------------------view Profile----------------------------
router.get('/profile',patientProfile);
// --------------------------------update Profile----------------------------
router.patch('/profile',updatePatientProfile);
// --------------------------------view doctors----------------------------
router.get('/getDoctors',viewDoctors);
// --------------------------------view doctors by id--------------------------
router.get('/getDoctor/:id',getDoctorById);
// --------------------------------view doctors by id--------------------------
router.post('/create-appointment',createAppointment);


export {router as patientRoute};