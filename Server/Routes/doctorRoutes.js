import express from "express";
import { doctorLogin, doctorLogout, doctorProfile, doctorSignup, updateProfile, updateService } from "../controllers/doctorController.js";
import { requireAuth } from "../middlewares/auth.js";

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
router.get('/logout',doctorLogout);



export {router as doctorRoute};