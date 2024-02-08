import express from "express";
import { confirmAppointment, doctorLogin, doctorProfile, doctorSignup, getAppointments, logout, updateAppointmentStatus, updateProfile, updateService } from "../controllers/doctorController.js";
import { requireAuth } from "../middlewares/auth.js";
import { getAppointmentByID } from "../controllers/patientController.js";

const router = express.Router();
// --------------------------------Signup----------------------------
router.post('/signup',doctorSignup);
// --------------------------------Login----------------------------
router.post('/login',doctorLogin);

router.use(requireAuth);
// --------------------------------Profile----------------------------
router.get('/profile',doctorProfile);
router.patch('/profile',updateProfile);

// --------------------------------change availability----------------------------
router.get('/service',updateService);

// --------------------------------confirm Appointment----------------------------
router.get('/confirm-appointment/:id',confirmAppointment);

// --------------------------------view Appointments----------------------------
router.get('/appointments',getAppointments);

// --------------------------------change status----------------------------
router.post('/update-status',updateAppointmentStatus);

// --------------------------------view Appointment by ID----------------------------
router.get('/appointment/:id',getAppointmentByID);

// --------------------------------Logout----------------------------
router.get('/logout',logout);



export {router as doctorRoute};