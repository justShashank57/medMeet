import express from "express";
import cors from "cors";
import { adminRoute } from "../Routes/adminRoutes.js";
import { doctorRoute } from "../Routes/doctorRoutes.js";
import { patientRoute } from "../Routes/patientRoutes.js";

export default async (app)=>{
    app.use(cors());
    // body parsing
    app.use(express.json());
 
    app.use('/admin',adminRoute);
    app.use('/doctor',doctorRoute);
    app.use('/patient',patientRoute);
    
    //CORS
    return app;
}