import express from "express";
import { patientLogin, patientProfile, patientSignup, updatePatientProfile } from "../controllers/patientController.js";
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

export {router as patientRoute};