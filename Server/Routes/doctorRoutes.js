import express from "express";
import { doctorLogin, doctorSignup } from "../controllers/doctorController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();
// --------------------------------Signup----------------------------
router.post('/signup',doctorSignup);
// --------------------------------Login----------------------------
router.post('/login',requireAuth,doctorLogin);
// requireAuth();

export {router as doctorRoute};