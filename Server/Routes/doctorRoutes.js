import express from "express";

const router = express.Router();
// --------------------------------Login----------------------------
router.post('/signup');
// --------------------------------SignUp----------------------------
router.post('/login');

export {router as doctorRoute};