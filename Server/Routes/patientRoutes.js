import express from "express";
import { patientLogin, patientSignup } from "../controllers/patientController.js";

const router = express.Router();
// --------------------------------SignUp----------------------------
router.post('/signup',patientSignup);
// --------------------------------Login----------------------------
router.post('/login',patientLogin);

export {router as patientRoute};