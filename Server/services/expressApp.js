import express from "express";
import cors from "cors";

export default async (app)=>{
    app.use(cors());
    // body parsing
    app.use(express.json());
 
    app.use('/admin');
    app.use('/doctor');
    app.use('/patient');
    
    //CORS
    return app;
}