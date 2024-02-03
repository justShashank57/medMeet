import express from "express";
import { createDoctor, deleteDoctor, getDoctor, getDoctors } from "../controllers/adminController.js";

const router = express.Router();

router.post('/doctor',createDoctor);
router.get('/doctor/:id',getDoctor);
router.get('/doctors',getDoctors);
router.delete('/doctor/:id',deleteDoctor);

export {router as adminRoute};